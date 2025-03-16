import {db} from "@repo/db";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events"

async function main(){
    const kafka = new Kafka({
        clientId: 'sweeper-outbox',
        brokers: ['9092'],
    })
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
