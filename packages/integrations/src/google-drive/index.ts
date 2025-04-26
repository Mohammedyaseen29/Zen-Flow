    // packages/integrations/src/google-drive/index.ts
    import { google } from 'googleapis';
    import dotenv from 'dotenv'
    dotenv.config()

    const oauth2Client = new google.auth.OAuth2(
    
    );

    export const googleDriveIntegration : any =  {
    id: 'google-drive',
    name: 'Google Drive',
    oauth: {
        getAuthUrl: (state:string) => {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive'],
            state
        });
        },
        handleCallback: async (code: string) => {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens; // { access_token, refresh_token, expiry_date }
        },
    },
    triggers: {
        'new-file-uploaded': async (flow: any, options: { accessToken: string, refreshToken: string, webhookUrl: string }) => {
        console.log('Setting up Google Drive webhook for flow:', flow.id);
        
        try {
            // Set credentials for the OAuth client
            oauth2Client.setCredentials({
            access_token: options.accessToken,
            refresh_token: options.refreshToken
            });
            
            const drive = google.drive({ version: 'v3', auth: oauth2Client });
            
            // Get or create a notification channel for this user and flow
            
            // In Google Drive's API, we need to use the "changes.watch" method
            // This method creates a notification channel that sends events to your webhook
            
            // First check if we need to stop any existing watch
            const flowMetadata = typeof flow.trigger.metadata === 'string' 
                ? JSON.parse(flow.trigger.metadata) 
                : flow.trigger.metadata;
                
            // If there's an existing channel ID and resource ID, stop watching
            if (flowMetadata.channelId && flowMetadata.resourceId) {
            try {
                await drive.channels.stop({
                requestBody: {
                    id: flowMetadata.channelId,
                    resourceId: flowMetadata.resourceId
                }
                });
                console.log(`Stopped existing watch for flow ${flow.id}`);
            } catch (stopError) {
                console.log(`Error stopping existing watch: ${stopError}`);
                // Continue even if there's an error stopping the existing watch
            }
            }
            
            // Create a new channel ID for this flow
            const channelId = `flow-${flow.id}-${Date.now()}`;
            
            // Start watching for changes
            const watchResponse = await drive.changes.watch({
            pageToken: 'initial', // Get the initial change token
            requestBody: {
                id: channelId,
                type: 'web_hook',
                address: options.webhookUrl,
                payload: true,
                params: {
                flowId: flow.id,
                userId: flow.userId
                }
            }
            });
            
            // Store the channel ID and resource ID in the flow's metadata
            // This is needed to stop watching when the flow is deactivated
            await drive.files.watch
            
            const updatedMetadata = {
            ...flowMetadata,
            channelId: watchResponse.data.id,
            resourceId: watchResponse.data.resourceId,
            expiration: watchResponse.data.expiration
            };
            
            // Update the flow's trigger metadata with the channel info
            // This needs to be done outside this function since we're already in a transaction
            
            console.log(`Successfully set up Google Drive webhook for flow ${flow.id}`);
            
            return updatedMetadata;
        } catch (error) {
            console.error(`Error setting up Google Drive webhook: ${error}`);
            throw error;
        }
        },
    },
    actions: {
        // No actions defined for Google Drive in this automation
    },
    helpers: {
        getFolders: async (accessToken: string) => {
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        oauth2Client.setCredentials({ access_token: accessToken });
        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder'",
            fields: 'files(id, name)',
            spaces: 'drive'
        });
        return response.data.files;
        }
    },
    getDriveClient: (accessToken: string) => {
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.drive({ version: 'v3', auth: oauth2Client });
    },
    
    getOAuth2Client: () => {
        return oauth2Client;
    }
    };