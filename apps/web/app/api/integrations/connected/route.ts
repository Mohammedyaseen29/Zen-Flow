// File: /app/api/integrations/connected/route.ts
    import { NextRequest, NextResponse } from 'next/server';
    import { db } from '@repo/db/client';
    import { getServerSession } from 'next-auth';
    import { nextAuth } from '@/lib/auth';

    export async function GET(req: NextRequest) {
    try {
        // Get current user session
        const session = await getServerSession(nextAuth);

        if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get all integrations to build our mapping
        const integrations = await db.integration.findMany({
        select: {
            id: true,
            name: true,
        }
        });

        // Create mapping of integration name to ID
        const integrationNameToIdMap: Record<string, string> = {};
        integrations.forEach(integration => {
        // Convert integration name to a format likely used as provider in accounts
        // e.g., "Google Drive" -> "google-drive"
        const providerName = integration.name.toLowerCase().replace(/\s+/g, '-');
        integrationNameToIdMap[providerName] = integration.id;
        });

        // Get all user's connected accounts
        const accounts = await db.account.findMany({
        where: {
            userId: userId,
            access_token: {
            not: null
            }
        },
        select: {
            provider: true,
            expires_at: true,
        }
        });

        // Check for expired tokens (current time in seconds)
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Map connected provider names to integration IDs
        const connectedIntegrationIds = accounts
        .map(account => integrationNameToIdMap[account.provider])
        .filter(Boolean); // Remove any undefined values

        // Map expired tokens to integration IDs
        const expiredIntegrationIds = accounts
        .filter(account => {
            // Check if token is expired (if expires_at exists and is less than current time)
            return account.expires_at && account.expires_at < currentTime;
        })
        .map(account => integrationNameToIdMap[account.provider])
        .filter(Boolean);

        // For debugging purposes, also return the original provider names
        const connectedProviders = accounts.map(account => account.provider);

        return NextResponse.json({ 
        connectedIntegrationIds,
        expiredIntegrationIds,
        connectedProviders,
        integrationMap: integrationNameToIdMap
        });
    } catch (error) {
        console.error('Failed to fetch connected integrations:', error);
        return NextResponse.json(
        { error: 'Failed to fetch connected integrations' },
        { status: 500 }
        );
    }
    }