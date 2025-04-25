    import {googleDriveIntegration} from './google-drive';
    import {googleClassroomIntegration} from './classroom';

    export const integrations = {
    '42ad074a-8084-4fd2-94f3-7869941732b6': googleDriveIntegration,
    '454e620b-0768-46cc-b899-b888fc6a446a': googleClassroomIntegration,
    };

    export const integrationByName ={
        'google-drive': googleDriveIntegration,
        'google-classroom': googleClassroomIntegration,
    }

    export function getIntegrationById(id: string) {
        return integrations[id as keyof typeof integrations];
    }
    export function getIntegrationByName(name: string) {
        return integrationByName[name as keyof typeof integrationByName];
    }
    