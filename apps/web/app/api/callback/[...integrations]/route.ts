    import { NextRequest, NextResponse } from 'next/server';
    import { db } from '@repo/db/client';
    import { getIntegrationByName } from '@repo/integrations/apps';
    import { getServerSession } from 'next-auth';
    import { nextAuth } from '@/lib/auth';

    export async function GET(req: NextRequest,{params}:{params:{integrations:string}}) {
    const integrations = params.integrations;
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    const session = await getServerSession(nextAuth);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }
    if (!state) {
        return NextResponse.json({ error: 'No state provided' }, { status: 400 });
    }

    try {
        const integration = getIntegrationByName(integrations);
        if (!integration || !integration.oauth?.handleCallback) {
        return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
        }

        // Get tokens from the OAuth callback
        const tokens = await integration.oauth.handleCallback(code);
        
        // Log the tokens structure to understand what we're getting
        console.log('Received tokens structure:', {
        access_token: tokens.access_token ? 'present' : 'missing',
        refresh_token: tokens.refresh_token ? 'present' : 'missing',
        expiry_date: tokens.expiry_date,
        });
        
        // Use a fallback provider account ID
        const providerAccountId = `google-${session.user.id}`;
        const userId = session.user.id;
        
        // Convert expiry_date to INT4 compatible format if needed
        // Option 1: Convert from milliseconds to seconds (reduces the number size)
        const expiresAt = typeof tokens.expiry_date === 'number' 
        ? Math.floor(tokens.expiry_date / 1000) 
        : undefined;
        
        console.log('Original expiry:', tokens.expiry_date, 'Converted expiry:', expiresAt);

        // Store the token in the database
        await db.account.upsert({
        where: {
            provider_providerAccountId: {
            provider: integration.id,
            providerAccountId,
            },
        },
        update: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt, // Use the converted value
            scope: tokens.scope,
            token_type: tokens.token_type,
            id_token: tokens.id_token,
        },
        create: {
            userId,
            type: 'oauth',
            provider: integration.id,
            providerAccountId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt, // Use the converted value
            scope: tokens.scope,
            token_type: tokens.token_type,
            id_token: tokens.id_token,
        },
        });

        // Redirect back to the original page
        const redirectUrl = decodeURIComponent(state);
        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error('OAuth callback failed:', error);
        return NextResponse.json({ 
        error: `OAuth callback failed: ${error}` 
        }, { status: 500 });
    }
    }