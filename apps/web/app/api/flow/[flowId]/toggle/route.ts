    // apps/web/app/api/flows/[flowId]/toggle/route.ts
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
            }
            }
        });

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
            
            // Get the Google Drive integration
            const driveIntegration = getIntegrationByName('google-drive');
            
            // Register webhook for this flow
            if (driveIntegration.triggers['new-file-uploaded']) {
            await driveIntegration.triggers['new-file-uploaded'](flow, {
                accessToken: userAccount.access_token,
                refreshToken: userAccount.refresh_token,
                webhookUrl: `${process.env.HOOKS_SERVICE_URL}/drive/webhook`
            });
            }
        }
        
        });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error toggling flow:", error);
        return NextResponse.json(
        { error: "Failed to toggle flow" },
        { status: 500 }
        );
    }
    }