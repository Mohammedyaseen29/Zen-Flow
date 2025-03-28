import {db} from "@repo/db/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events"

const kafka = new Kafka({
        clientId: 'outbox-processor',
        brokers: ['9092'],
})
async function main() {
    const consumer = kafka.consumer({ groupId: 'my-group' })
    await consumer.connect();
    await consumer.subscribe({ topic:TOPIC_NAME, fromBeginning: true })
}
main();