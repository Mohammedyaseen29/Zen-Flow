// apps/sweeper/src/main.ts
import { db } from "@repo/db/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events";
const POLL_INTERVAL = 5000; // 5 seconds between polls
const BATCH_SIZE = 10;

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'], // Update with your Kafka broker address
});

async function processOutboxBatch() {
    try {
        // Begin transaction
        await db.$transaction(async (txn) => {
            // Find pending outbox entries
            const pendingTasks = await txn.flowStateOutBox.findMany({
                take: BATCH_SIZE,
                include: {
                    flowState: true
                }
            });

            if (pendingTasks.length === 0) {
                return; // No tasks to process
            }

            console.log(`Processing ${pendingTasks.length} outbox entries`);

            // Send messages to Kafka
            const producer = kafka.producer();
            await producer.connect();
            
            await producer.send({
                topic: TOPIC_NAME,
                messages: pendingTasks.map((task) => ({
                    key: task.flowState.flowId, // Using flowId as the key for partitioning
                    value: JSON.stringify(task.flowStateId),
                    headers: {
                        'source': Buffer.from('outbox-sweeper'),
                        'timestamp': Buffer.from(Date.now().toString())
                    }
                }))
            });
            
            await producer.disconnect();

            // Delete processed entries from outbox
            await txn.flowStateOutBox.deleteMany({
                where: {
                    id: {
                        in: pendingTasks.map((task) => task.id)
                    }
                }
            });

            console.log(`Successfully processed and removed ${pendingTasks.length} outbox entries`);
        });
    } catch (error) {
        console.error('Error processing outbox batch:', error);
    }
}

async function main() {
    console.log('Starting outbox sweeper service...');

    // Run the sweeper in an infinite loop with a delay between iterations
    while (true) {
        await processOutboxBatch();
        
        // Wait for the next polling interval
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down sweeper service...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down sweeper service...');
    process.exit(0);
});

// Start the sweeper
main().catch(error => {
    console.error('Sweeper service failed:', error);
    process.exit(1);
});