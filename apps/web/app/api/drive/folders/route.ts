import { getServerSession } from 'next-auth';
    import { nextAuth } from '@/lib/auth';
    import { db } from '@repo/db/client';
    import { getIntegrationByName } from '@repo/integrations/apps';
    import { NextRequest, NextResponse } from 'next/server';
    import { google } from 'googleapis';

    export async function GET(req: NextRequest) {
    const session = await getServerSession(nextAuth);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' });
    }

    try {
        const account = await db.account.findFirst({
        where: { userId: session.user.id, provider: 'google-drive' },
        });
        
        if (!account) {
        return NextResponse.json({ error: 'Google Drive account not connected' });
        }

        const integration = getIntegrationByName('google-drive');
        if (!integration || !integration.helpers?.getFolders) {
        return NextResponse.json({ error: 'Integration not found' }); 
        }
        const folders = await integration.helpers.getFolders(account.access_token);
        return NextResponse.json(folders);
    } catch (error) {
        console.error('Failed to fetch folders:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' });
    }
    }