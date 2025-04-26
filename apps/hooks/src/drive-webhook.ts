    // apps/hooks/src/drive-webhook.ts
    import express from "express";
    import { db } from "@repo/db/client";
    import { Router } from "express";

    const driveRouter : express.Router = Router();

    // Google Drive webhook handler
    //@ts-ignore
    driveRouter.post("/drive/webhook", async (req, res) => {
    try {
        const { fileId, fileDetails, userId } = req.body;
        
        // Find user's active flows with Google Drive new-file trigger
        const userFlows = await db.flow.findMany({
        where: {
            userId,
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
        
        // If there are no active flows, return early
        if (userFlows.length === 0) {
        return res.status(200).json({ message: "No active flows for this event" });
        }

        // For each flow, create a flow state and outbox entry
        await Promise.all(userFlows.map(async (flow) => {
        return db.$transaction(async (txn) => {
            // Create flow state
            const state = await txn.flowState.create({
            data: {
                flowId: flow.id,
                status: 'pending',
                metaData: {
                fileDetails: {
                    fileId,
                    ...fileDetails
                },
                triggeredAt: new Date().toISOString()
                }
            }
            });
            
            // Create outbox entry
            await txn.flowStateOutBox.create({
            data: {
                flowStateId: state.id
            }
            });
        });
        }));
        
        res.status(200).json({ message: "Drive webhook processed successfully" });
    } catch (error) {
        console.error("Error processing Drive webhook:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
    });

    export { driveRouter };