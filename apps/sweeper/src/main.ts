import {db} from "@repo/db/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events"

const kafka = new Kafka({
        clientId: 'outbox-processor',
        brokers: ['9092'],
})

async function main(){
    const producer = kafka.producer();
    await producer.connect();


    while(1){
        const pendingTask = await db.flowStateOutBox.findMany({
            take:10,
        })

        await producer.send({
            topic:TOPIC_NAME,
            messages:pendingTask.map((t:any)=>(
                {value:t.flowStateId}
            ))
        })

        await db.flowStateOutBox.deleteMany({
            where:{
                id:{
                    in:pendingTask.map((t:any)=>t.id)
                }
            }
        })
    }

}

main();
