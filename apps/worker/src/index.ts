    // apps/worker/src/index.ts
    import { db } from "@repo/db/client";
    import { Kafka } from "kafkajs";
    import { getIntegrationById, getIntegrationByName } from "@repo/integrations/apps";

    const TOPIC_NAME = "flow-events";

    const kafka = new Kafka({
    clientId: 'flow-worker',
    brokers: ['localhost:9092'],
    });

    async function executeFlow(flowStateId: string) {
    try {
        // Get the flow state with related flow details
        const flowState = await db.flowState.findUnique({
        where: { id: flowStateId },
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
                user: true // Include user to get auth tokens
            }
            }
        }
        });

        if (!flowState) {
        console.error(`Flow state ${flowStateId} not found`);
        return;
        }

        // Mark the flow as processing
        await db.flowState.update({
        where: { id: flowStateId },
        data: { status: 'processing' }
        });

        // Execute the flow based on the trigger type
        const { flow } = flowState;
        
        // Handle Google Drive "new-file-uploaded" trigger
        if (flow.trigger?.type?.name === 'new-file-uploaded') {
        // Get user's Google credentials
        const userAccount = await db.account.findFirst({
            where: {
            userId: flow.userId,
            provider: 'google'
            }
        });
        
        if (!userAccount) {
            throw new Error("User not connected to Google account");
        }
        
        const accessToken = userAccount.access_token;
        
        // Get the Drive integration
        const driveIntegration = getIntegrationByName('google-drive');
        
        // Get file details from the trigger metadata
        //@ts-ignore
        const fileDetails = flowState.metaData.fileDetails || {
            fileId: 'sample-file-id', // In a real scenario, this would come from the webhook
            fileName: 'Sample Document',
            mimeType: 'application/pdf'
        };
        
        // Process each action
        for (const action of flow.action) {
            // Extract action metadata
            const actionMetadata = typeof action.metaData === 'string' 
            ? JSON.parse(action.metaData) 
            : action.metaData;
            
            // For sending a notification to Google Classroom
            if (action.type.name === 'send-notification') {
            // Get the Classroom integration
            const classroomIntegration = getIntegrationByName('google-classroom');
            
            try {
                // First, upload the file to the classroom course materials
                
                // 1. Get the file from Google Drive
                const drive = driveIntegration.getDriveClient(accessToken);
                const file = await drive.files.get({
                fileId: fileDetails.fileId,
                fields: 'id,name,mimeType,webContentLink',
                supportsAllDrives: true
                });
                
                // 2. Get file content
                const fileContent = await drive.files.get({
                fileId: fileDetails.fileId,
                alt: 'media'
                }, { responseType: 'stream' });
                
                // 3. Create a course material in Google Classroom
                const classroom = classroomIntegration.getClassroomClient(accessToken);
                
                // Create a course material with the file attached
                const courseWorkMaterial = await classroom.courses.courseWorkMaterials.create({
                courseId: actionMetadata.courseId,
                requestBody: {
                    title: `New File: ${file.data.name}`,
                    description: `Automatically uploaded from Google Drive`,
                    materials: [
                    {
                        driveFile: {
                        driveFile: {
                            id: fileDetails.fileId,
                            title: file.data.name
                        }
                        }
                    }
                    ],
                    state: 'PUBLISHED'
                }
                });
                
                // 4. Send a notification announcement to the class
                await classroomIntegration.actions['send-notification'](
                {
                    courseId: actionMetadata.courseId,
                    message: `New file uploaded: ${fileDetails.fileName} - Check course materials for the attached file.`,
                },
                { accessToken }
                );
                
                console.log(`Successfully processed flow ${flow.id} for file ${fileDetails.fileId}`);
                console.log(`File uploaded to Google Classroom course ${actionMetadata.courseId}`);
            } catch (actionError) {
                console.error(`Action execution failed: ${actionError}`);
                await db.flowState.update({
                where: { id: flowStateId },
                data: { 
                    status: 'failed',
                    metaData: {
                        //@ts-ignore
                    ...flowState.metaData,
                    error: `Action execution failed: ${actionError}`
                    }
                }
                });
                return;
            }
            }
        }
        
        // Mark the flow as completed
        await db.flowState.update({
            where: { id: flowStateId },
            data: { 
            status: 'completed',
            completedAt: new Date()
            }
        });
        }
    } catch (error) {
        console.error(`Flow execution error: ${error}`);
        await db.flowState.update({
        where: { id: flowStateId },
        data: { 
            status: 'failed',
            metaData: {
                //@ts-ignore
            ...(await db.flowState.findUnique({ where: { id: flowStateId } }))?.metaData,
            error: `Flow execution failed: ${error}`
            }
        }
        });
    }
    }

    async function main() {
    const consumer = kafka.consumer({ groupId: 'flow-worker-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        const flowStateId = message.value?.toString();
        
        if (flowStateId) {
            console.log(`Processing flow state: ${flowStateId}`);
            await executeFlow(flowStateId);
        }
        },
    });
    
    console.log('Worker started and listening for flow events');
    }

    main().catch(error => {
    console.error('Worker failed to start:', error);
    process.exit(1);
    });