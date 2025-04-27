// apps/web/app/api/flow/[flowId]/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@repo/db/client";
import { getIntegrationByName } from '@repo/integrations/apps';

export async function POST(
    request: NextRequest,
    { params }: { params: { flowId: string } }
) {
    try {
        const { flowId } = params;
        const { active } = await request.json();
        
        console.log(`Toggling flow ${flowId} active status to ${active}`);
        
        // Update flow status and create outbox entry in a transaction
        await db.$transaction(async (txn) => {
            // Update flow active status
            const flow = await txn.flow.update({
                where: { id: flowId },
                data: { active },
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
            });

            console.log(`Flow updated, trigger type: ${flow.trigger?.type?.name}`);

            // Only process further if activating and it's a Google Drive trigger
            if (active && flow.trigger?.type?.name === 'New File Uploaded') {
                // Get user's access token for Google Drive
                const userAccount = await txn.account.findFirst({
                    where: {
                        userId: flow.userId,
                        provider: 'google-drive'
                    }
                });
                
                if (!userAccount) {
                    throw new Error("User not connected to Google account");
                }
                
                console.log(`Found user account for Google Drive, setting up webhook`);
                
                // Get the Google Drive integration
                const driveIntegration = getIntegrationByName('google-drive');
                
                // Register webhook for this flow
                if (driveIntegration && driveIntegration.triggers['new-file-uploaded']) {
                    const webhookUrl = `${process.env.HOOKS_SERVICE_URL}/drive/webhook`;
                    console.log(`Registering webhook at ${webhookUrl}`);
                    
                    const updatedMetadata = await driveIntegration.triggers['new-file-uploaded'](flow, {
                        accessToken: userAccount.access_token,
                        refreshToken: userAccount.refresh_token,
                        webhookUrl: webhookUrl
                    });
                    
                    // Update trigger metadata with webhook registration info
                    await txn.trigger.update({
                        where: { flowId: flow.id },
                        data: { 
                            metadata: updatedMetadata
                        }
                    });
                    
                    console.log(`Webhook registration complete, metadata updated`);
                } else {
                    console.error("Drive integration or new-file-uploaded trigger not found");
                }
            } else if (!active && flow.trigger?.type?.name === 'New File Uploaded') {
                // If deactivating, could add code to stop the webhook
                console.log(`Flow ${flowId} deactivated`);
            }
        });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error toggling flow:", error);
        return NextResponse.json(
            { error: "Failed to toggle flow", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}