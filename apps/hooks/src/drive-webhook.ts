// apps/hooks/src/drive-webhook.ts
import express from "express";
import { db } from "@repo/db/client";
import { Router } from "express";
import { getIntegrationByName } from "@repo/integrations/apps";

const driveRouter: express.Router = Router();

// Google Drive webhook handler
//@ts-ignore
driveRouter.post("/drive/webhook", async (req, res) => {
    try {
        console.log("Drive webhook received:", {
            headers: req.headers,
            query: req.query,
            body: req.body
        });
        
        // Extract flow and user IDs from query parameters
        const flowId = req.query.flowId as string;
        const userId = req.query.userId as string;
        
        if (!flowId || !userId) {
            console.log("Missing flow or user ID in webhook", req.query);
            return res.status(200).json({ message: "Webhook received but missing parameters" });
        }
        
        // Handle Google's validation requests
        const headers = req.headers;
        if (headers['x-goog-resource-state'] === 'sync') {
            console.log("Received sync validation request for webhook");
            return res.status(200).json({ message: "Webhook validation successful" });
        }
        
        // Only process file changes (created or modified)
        if (!['create', 'update'].includes(headers['x-goog-resource-state'] as string)) {
            return res.status(200).json({ message: "Not a file creation/update event" });
        }
        
        // Extract the correct file ID from the resource URI
        // The URI format is like: https://www.googleapis.com/drive/v3/files/FILE_ID?alt=json
        const resourceUri = headers['x-goog-resource-uri'] as string;
        let fileId: string | null = null;
        
        if (resourceUri) {
            // Parse the URI to extract the file ID
            const match = resourceUri.match(/\/files\/([^?]+)/);
            if (match && match[1]) {
                fileId = match[1];
                console.log(`Extracted file ID from resource URI: ${fileId}`);
            }
        }
        
        if (!fileId) {
            console.log("Could not extract file ID from resource URI");
            return res.status(200).json({ message: "No valid file ID found" });
        }
        
        // Find associated flow
        const flow = await db.flow.findFirst({
            where: {
                id: flowId,
                userId: userId,
                active: true,
                trigger: {
                    type: {
                        name: 'New File Uploaded'
                    }
                }
            },
            include: {
                trigger: {
                    include: {
                        type: true
                    }
                }
            }
        });
        
        if (!flow) {
            console.log(`No active flow found for ID ${flowId} and user ${userId}`);
            return res.status(200).json({ message: "No matching active flow found" });
        }

        console.log(`Processing webhook for flow: ${flow.id}`);
        
        // Get user's Google Drive credentials
        const userAccount = await db.account.findFirst({
            where: {
                userId: flow.userId,
                provider: 'google-drive'
            }
        });
        
        if (!userAccount) {
            console.error(`No Google Drive account found for user ${flow.userId}`);
            return res.status(200).json({ message: "No Google account for this user" });
        }
        
        // Get file details from Google Drive API
        const driveIntegration = getIntegrationByName('google-drive');
        const drive = driveIntegration.getDriveClient(userAccount.access_token);
        
        let fileDetails: {
            fileId: string;
            fileName?: string;
            mimeType?: string;
            webViewLink?: string;
            createdTime?: string;
            size?: number;
            parents?: string[];
            changeType?: string;
            changedBy?: string;
        };
        try {
            // Get detailed file information
            const fileResponse = await drive.files.get({
                fileId: fileId,
                fields: 'id,name,mimeType,webViewLink,createdTime,size,parents'
            });
            
            fileDetails = {
                fileId: fileResponse.data.id,
                fileName: fileResponse.data.name,
                mimeType: fileResponse.data.mimeType,
                webViewLink: fileResponse.data.webViewLink,
                createdTime: fileResponse.data.createdTime,
                size: fileResponse.data.size,
                parents: fileResponse.data.parents
            };
            
            // Check if it's a folder
            const isFolder = fileDetails.mimeType === 'application/vnd.google-apps.folder';
            
            // Log info but don't stop processing for folders
            if (isFolder) {
                console.log(`Item is a folder: ${fileDetails.fileName} (${fileDetails.fileId})`);
            }
            
            console.log(`Retrieved file details for ${fileDetails.fileName} (${fileDetails.fileId})`);
            
            // Verify this file belongs to the monitored folder
            const triggerMetadata = typeof flow?.trigger?.metadata === 'string'
                ? JSON.parse(flow?.trigger?.metadata) 
                : flow?.trigger?.metadata;
                
            const monitoredFolderId = triggerMetadata.folderId;
            
            // Skip if this file isn't in the monitored folder
            if (monitoredFolderId && fileDetails.parents && 
                !fileDetails.parents.includes(monitoredFolderId)) {
                console.log(`File ${fileDetails.fileId} is not in the monitored folder ${monitoredFolderId}`);
                return res.status(200).json({ message: "File not in monitored folder" });
            }
            
        } catch (fileError) {
            console.error(`Error fetching file details: ${fileError}`);
            // Continue with basic file info if detailed fetch fails
            fileDetails = {
                fileId,
                changeType: headers['x-goog-resource-state'] as string,
                changedBy: headers['x-goog-changed'] as string
            };
        }
        
        // Create flow state and outbox entry - even for folders
        // Let the worker service decide how to handle folders
        await db.$transaction(async (txn) => {
            const state = await txn.flowState.create({
                data: {
                    flowId: flow.id,
                    status: 'pending',
                    metaData: {
                        fileDetails,
                        triggeredAt: new Date().toISOString()
                    }
                }
            });
            
            await txn.flowStateOutBox.create({
                data: {
                    flowStateId: state.id
                }
            });
            
            console.log(`Created flow state ${state.id} for file ${fileId}`);
        });
        
        res.status(200).json({ message: "Drive webhook processed successfully" });
    } catch (error) {
        console.error("Error processing Drive webhook:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export { driveRouter };