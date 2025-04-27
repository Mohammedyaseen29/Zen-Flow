    // packages/integrations/src/classroom/index.ts
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
            prompt: 'consent',
            scope: [
            'https://www.googleapis.com/auth/classroom.courses',
            'https://www.googleapis.com/auth/classroom.coursework.me',
            'https://www.googleapis.com/auth/classroom.announcements',
            'https://www.googleapis.com/auth/classroom.courseworkmaterials'
            ],
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
            oauth2Client.setCredentials({ access_token: context.accessToken });
            const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
            
            try {
                console.log(`Sending classroom announcement to course ${params.courseId}: ${params.message}`);
                
                const result = await classroom.courses.announcements.create({
                    courseId: params.courseId,
                    requestBody: { 
                        text: params.message,
                        state: 'PUBLISHED'
                    },
                });
                
                console.log(`Successfully sent announcement, ID: ${result.data.id}`);
                return { 
                    success: true, 
                    announcementId: result.data.id,
                    message: 'Notification sent successfully' 
                };
            } catch (error) {
                console.error('Error sending classroom notification:', error);
                throw error;
            }
        },
        'upload-file-to-course': async (params: { 
            courseId: string; 
            fileId: string;
            fileName: string;
            description?: string;
        }, context: { accessToken: string }) => {
            oauth2Client.setCredentials({ access_token: context.accessToken });
            const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
            
            try {
                console.log(`Creating course material for file ${params.fileId} in course ${params.courseId}`);
                
                // Create a course material with the Drive file
                const courseWorkMaterial = await classroom.courses.courseWorkMaterials.create({
                    courseId: params.courseId,
                    requestBody: {
                        title: params.fileName,
                        description: params.description || 'File uploaded from automation flow',
                        materials: [
                            {
                                driveFile: {
                                    driveFile: {
                                        id: params.fileId,
                                        title: params.fileName
                                    }
                                }
                            }
                        ],
                        state: 'PUBLISHED'
                    }
                });
                
                console.log(`Successfully created course material, ID: ${courseWorkMaterial.data.id}`);
                
                return { 
                    success: true, 
                    materialId: courseWorkMaterial.data.id,
                    message: 'File uploaded to course successfully' 
                };
            } catch (error) {
                console.error('Error uploading file to course:', error);
                throw error;
            }
        }
    },
    helpers: {
        getClasses: async (accessToken: string) => {
            oauth2Client.setCredentials({ access_token: accessToken });
            const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
            const response = await classroom.courses.list();
            return response.data.courses; 
        },
        getClassroomClient: (accessToken: string) => {
            oauth2Client.setCredentials({ access_token: accessToken });
            return google.classroom({ version: 'v1', auth: oauth2Client });
        }
    }
};