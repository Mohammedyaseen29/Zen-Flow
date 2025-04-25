    import { google } from 'googleapis';
    import dotenv from 'dotenv'
    dotenv.config()

    const oauth2Client = new google.auth.OAuth2(
    
    );

    export const googleClassroomIntegration : any = {
    id: 'google-classroom',
    name: 'Google Classroom',
    oauth: {
        getAuthUrl: (state:string) => {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/classroom.courses'],
            state
        });
        },
        handleCallback: async (code: string) => {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens; // { access_token, refresh_token, expiry_date }
        },
    },
    triggers: {
        // No triggers defined for Google Classroom in this automation
    },
    actions: {
        'send-notification': async (params: { courseId: string; message: string }, context: { accessToken: string }) => {
        const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
        oauth2Client.setCredentials({ access_token: context.accessToken });
        await classroom.courses.announcements.create({
            courseId: params.courseId,
            requestBody: { text: params.message },
        });
        },
    },
    helpers:{
        getClasses:async (accessToken:string) => {
            const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
            oauth2Client.setCredentials({ access_token: accessToken });
            const response = await classroom.courses.list();
            return response.data.courses; 
        }
    }
    };