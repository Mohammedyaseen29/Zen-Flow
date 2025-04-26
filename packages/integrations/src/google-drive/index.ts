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
        'new-file-uploaded': async (flow: any) => {
        console.log('Setting up Google Drive webhook for flow:', flow.id);
        // Webhook setup is handled in the backend
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
    }
    };