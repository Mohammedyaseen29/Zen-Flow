
    import { getServerSession } from 'next-auth';
    import { nextAuth } from '@/lib/auth';
    import { db } from '@repo/db/client';
    import { getIntegrationByName } from '@repo/integrations/apps';
    import { NextRequest, NextResponse } from 'next/server';

    export async function GET(req: NextRequest) {
    const session = await getServerSession(nextAuth);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' });
    }

    try {
        const account = await db.account.findFirst({
        where: { userId: session.user.id, provider: 'google-classroom' },
        });
        if (!account) {
        return NextResponse.json({ error: 'Google Classroom account not connected' });
        }

        const integration = getIntegrationByName('google-classroom');
        if (!integration || !integration.helpers?.getClasses) {
        return NextResponse.json({ error: 'Integration not found' });
        }

        const classes = await integration.helpers.getClasses(account.access_token);
        return NextResponse.json(classes);
    } catch (error) {
        console.error('Failed to fetch classes:', error);
        return NextResponse.json({ error: 'Failed to fetch classes' });
    }
    }