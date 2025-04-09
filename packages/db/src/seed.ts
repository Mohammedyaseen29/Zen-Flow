import {db} from "./index"

async function seed() {
    try {
        const avaialbleTrigger = await db.availableTriggers.createMany({
            data:[
                {
                    name:"webhook",
                    image:"https://res.cloudinary.com/dbzdzrghh/image/upload/v1744012895/webhooks-logo-png_seeklogo-274079_exnlrc.png"
                }
            ]
        })
        const avaialbleAction = await db.availableActions.createMany({
            data:[
                {
                    name:"Send Email",
                    image:"https://res.cloudinary.com/dbzdzrghh/image/upload/v1744013154/360_F_238966486_A5wEWiRNtuUm85Qxj5BM12hCDNrSS7yS_xm7sll.jpg"
                },
                {
                    name: "Send Solana",
                    image:"https://res.cloudinary.com/dbzdzrghh/image/upload/v1744013249/solana-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-crypto-coin-pack-logos-icons-8263859_eveybn.webp"
                }
            ],
            skipDuplicates:true
        }) 
    } catch (error) {
        console.log(error)
    }
}

seed();