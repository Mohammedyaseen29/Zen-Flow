import {db} from "./index"

const seed = async () => {
    try {
        const googleDrive = await db.integration.create({
            data: {
                name: "Google Drive",
                image:"https://res.cloudinary.com/dbzdzrghh/image/upload/v1744991856/Google_Drive_icon__282020_29_msask7.svg",

            }
        })
        const classRoom = await db.integration.create({
            data:{
                name: "Google Classroom",
                image:"https://res.cloudinary.com/dbzdzrghh/image/upload/v1745140410/Google_Classroom_Logo_gjisgd.png"
            }
        })
        await db.availableTriggers.create({
            data:{
                name: "New File Uploaded",
                integrationId: googleDrive.id,
                fields:[
                    {name: 'folderId', type:'select',label:"Folder Id", required:true},
                ]
            }
        })
        await db.availableActions.create({
            data:{
                name:"Send Notification",
                integrationId: classRoom.id,
                fields:[
                    {name: 'courseId', type: 'select',label:"Course Id", required:true},
                    { name: 'message', type: 'string', label: 'Message' },
                ]
            }
        })
        console.log("seeded");
    } catch (error) {
        console.log(error);
    }

}

seed();