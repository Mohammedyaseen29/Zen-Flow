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
            prompt: 'consent',
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
                
                // Get folder ID from flow metadata
                const flowMetadata = typeof flow.trigger.metadata === 'string' 
                    ? JSON.parse(flow.trigger.metadata) 
                    : flow.trigger.metadata;
                
                const folderId = flowMetadata.folderId;
                
                if (!folderId) {
                    throw new Error("No folder ID specified in flow metadata");
                }
                
                // Verify the folder exists and get its details
                try {
                    const folderResponse = await drive.files.get({
                        fileId: folderId,
                        fields: 'id,name,mimeType'
                    });
                    
                    if (folderResponse.data.mimeType !== 'application/vnd.google-apps.folder') {
                        throw new Error("The specified ID is not a folder");
                    }
                    
                    console.log(`Setting up webhook for folder: ${folderResponse.data.name} (${folderId})`);
                } catch (folderError) {
                    console.error(`Error verifying folder: ${folderError}`);
                    throw new Error(`Unable to access the specified folder: ${folderError instanceof Error ? folderError.message : "Unknown error"}`);
                }
                
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
                
                // Watch for changes to the specific folder
                const watchResponse = await drive.files.watch({
                    fileId: folderId,
                    requestBody: {
                        id: channelId,
                        type: 'web_hook',
                        address: `${options.webhookUrl}?flowId=${flow.id}&userId=${flow.userId}`,
                        payload: true
                    }
                });
                
                // Return updated metadata
                const updatedMetadata = {
                    ...flowMetadata,
                    channelId: watchResponse.data.id,
                    resourceId: watchResponse.data.resourceId,
                    expiration: watchResponse.data.expiration
                };
                
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