// apps/worker/src/index.ts
import { db } from "@repo/db/client";
import { Kafka } from "kafkajs";
import { getIntegrationByName } from "@repo/integrations/apps";

const TOPIC_NAME = "flow-events";

const kafka = new Kafka({
    clientId: 'flow-worker',
    brokers: ['localhost:9092'],
});

async function executeFlow(flowStateId: string) {
    try {
        console.log(`Starting execution of flow state: "${flowStateId}"`);
        
        // Parse the flowStateId if it's received as a JSON string
        let parsedId = flowStateId;
        try {
            // If the ID is wrapped in quotes in the JSON string
            parsedId = JSON.parse(flowStateId);
        } catch (err) {
            // If it's already a string, use it as is
            console.log("Using flowStateId as-is, not JSON-encoded");
        }
        
        // Get the flow state with related flow details
        const flowState = await db.flowState.findUnique({
            where: { id: parsedId },
            include: {
                flow: {
                    include: {
                        trigger: {
                            include: {
                                type: true
                            }
                        },
                        action: {
                            include: {
                                type: true
                            }
                        },
                        user: true
                    }
                }
            }
        });

        if (!flowState) {
            console.error(`Flow state "${parsedId}" not found`);
            
            // Create a new entry in the outbox for retry
            await createRetryEntry(parsedId);
            return;
        }

        // Mark the flow as processing
        await db.flowState.update({
            where: { id: parsedId },
            data: { status: 'processing' }
        });

        // Execute the flow based on the trigger type
        const { flow } = flowState;
        console.log(`Processing flow ${flow.id} with trigger ${flow.trigger?.type?.name}`);
        
        // Fix the trigger name inconsistency - standardize the case
        const triggerName = flow.trigger?.type?.name?.toLowerCase();
        
        // Handle Google Drive trigger (adjust the name to match what's in your code)
        if (triggerName === 'new file uploaded' || triggerName === 'new-file-uploaded') {
            // Get user's Google credentials
            const userAccount = await db.account.findFirst({
                where: {
                    userId: flow.userId,
                    provider: 'google-drive' // Match the exact provider name
                }
            });
            
            if (!userAccount) {
                console.error("User not connected to Google account");
                throw new Error("User not connected to Google account");
            }
            
            const accessToken = userAccount.access_token;
            
            // Get the Drive integration
            const driveIntegration = getIntegrationByName('google-drive');
            
            // Get file details from the trigger metadata
            //@ts-ignore
            const fileDetails = flowState.metaData?.fileDetails || {};
            const fileId = fileDetails.fileId;
            
            if (!fileId) {
                throw new Error("No file ID found in flow state metadata");
            }
            
            console.log(`Processing file ID: ${fileId}`);
            
            // Get detailed file information
            const drive = driveIntegration.getDriveClient(accessToken);
            const fileInfo = await drive.files.get({
                fileId: fileId,
                fields: 'id,name,mimeType,webContentLink,webViewLink',
                supportsAllDrives: true
            });
            
            const fileName = fileInfo.data.name;
            const mimeType = fileInfo.data.mimeType;
            
            console.log(`File details - Name: ${fileName}, Type: ${mimeType}`);
            
            // Skip folders - only process actual files
            if (mimeType === 'application/vnd.google-apps.folder') {
                console.log(`Skipping folder - cannot process: ${fileName}`);
                await db.flowState.update({
                    where: { id: parsedId },
                    data: { 
                        status: 'skipped',
                        metaData: {
                            //@ts-ignore
                            ...flowState.metaData,
                            skippedReason: "Cannot process folders, only files"
                        }
                    }
                });
                return;
            }
            
            // Process each action
            for (const action of flow.action) {
                // Extract action metadata
                const actionMetadata = typeof action.metaData === 'string' 
                    ? JSON.parse(action.metaData) 
                    : action.metaData;
                
                // For sending a notification to Google Classroom
                if (action.type.name.toLowerCase() === 'send-notification') {
                    console.log(`Executing send-notification action to Google Classroom`);
                    
                    // Get the Classroom integration
                    const classroomIntegration = getIntegrationByName('google-classroom');
                    
                    // Get user's Classroom credentials
                    const classroomAccount = await db.account.findFirst({
                        where: {
                            userId: flow.userId,
                            provider: 'google-classroom'
                        }
                    });
                    
                    if (!classroomAccount) {
                        throw new Error("User not connected to Google Classroom account");
                    }
                    
                    const classroomAccessToken = classroomAccount.access_token;
                    
                    try {
                        // 1. Create a course material in Google Classroom
                        const classroom = classroomIntegration.getClassroomClient(classroomAccessToken);
                        
                        console.log(`Creating course material for file ${fileId} in course ${actionMetadata.courseId}`);
                        
                        // Create a course material with the file attached
                        const courseWorkMaterial = await classroom.courses.courseWorkMaterials.create({
                            courseId: actionMetadata.courseId,
                            requestBody: {
                                title: `New File: ${fileName}`,
                                description: `Automatically uploaded from Google Drive`,
                                materials: [
                                    {
                                        driveFile: {
                                            driveFile: {
                                                id: fileId,
                                                title: fileName
                                            }
                                        }
                                    }
                                ],
                                state: 'PUBLISHED'
                            }
                        });
                        
                        console.log(`Created course material in Classroom, ID: ${courseWorkMaterial.data.id}`);
                        
                        // 2. Send a notification announcement to the class
                        const notificationMessage = actionMetadata.message || 
                            `New file uploaded: ${fileName} - Check course materials for the attached file.`;
                            
                        console.log(`Sending notification to course ${actionMetadata.courseId}: ${notificationMessage}`);
                        
                        const announcementResult = await classroom.courses.announcements.create({
                            courseId: actionMetadata.courseId,
                            requestBody: { 
                                text: notificationMessage,
                                state: 'PUBLISHED'
                            },
                        });
                        
                        console.log(`Sent notification to course ${actionMetadata.courseId}, announcement ID: ${announcementResult.data.id}`);
                    } catch (actionError) {
                        console.error(`Action execution failed: ${actionError}`);
                        await db.flowState.update({
                            where: { id: parsedId },
                            data: { 
                                status: 'failed',
                                metaData: {
                                    //@ts-ignore
                                    ...flowState.metaData,
                                    error: `Action execution failed: ${actionError instanceof Error ? actionError.message : "Unknown error"}`
                                }
                            }
                        });
                        return;
                    }
                }
            }
            
            // Mark the flow as completed
            await db.flowState.update({
                where: { id: parsedId },
                data: { 
                    status: 'completed',
                    completedAt: new Date()
                }
            });
            
            console.log(`Flow ${flow.id} completed successfully`);
        }
    } catch (error) {
        console.error(`Flow execution error: ${error instanceof Error ? error.message : "Unknown error"}`);
        
        try {
            // Attempt to update the flow state if possible
            await db.flowState.update({
                where: { id: flowStateId },
                data: { 
                    status: 'failed',
                    metaData: {
                        //@ts-ignore
                        ...(await db.flowState.findUnique({ where: { id: flowStateId } }))?.metaData,
                        error: `Flow execution failed: ${error instanceof Error ? error.message : "Unknown error"}`
                    }
                }
            });
        } catch (updateError) {
            console.error(`Failed to update flow state: ${updateError}`);
            // Create a retry entry if we couldn't update
            await createRetryEntry(flowStateId);
        }
    }
}

// Function to create a retry entry in the outbox
async function createRetryEntry(flowStateId: string) {
    try {
        console.log(`Creating retry entry for flow state: ${flowStateId}`);
        
        // First check if this flow state exists
        const flowState = await db.flowState.findUnique({
            where: { id: flowStateId }
        });
        
        if (!flowState) {
            console.error(`Cannot create retry entry: Flow state ${flowStateId} not found`);
            return;
        }
        
        // Create a new outbox entry for retry
        await db.flowStateOutBox.create({
            data: {
                flowState: {
                    connect: {
                        id: flowStateId
                    }
                },
            }
        });
        
        console.log(`Retry entry created for flow state: ${flowStateId}`);
    } catch (error) {
        console.error(`Failed to create retry entry: ${error}`);
    }
}

async function main() {
    const consumer = kafka.consumer({ groupId: 'flow-worker-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
    
    console.log('Consumer connected and subscribed to topic:', TOPIC_NAME);
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value) {
                const flowStateId = message.value.toString();
                console.log(`Received message for flow state: "${flowStateId}"`);
                await executeFlow(flowStateId);
            } else {
                console.error("Received message with null or undefined value");
            }
        },
    });
    
    console.log('Worker started and listening for flow events');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down worker service...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down worker service...');
    process.exit(0);
});

// Start the worker
main().catch(error => {
    console.error('Worker failed to start:', error);
    process.exit(1);
});