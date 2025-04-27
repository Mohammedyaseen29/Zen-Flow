// apps/sweeper/src/main.ts
import { db } from "@repo/db/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events";
const POLL_INTERVAL = 5000; // 5 seconds between polls
const BATCH_SIZE = 10;

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
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
            
            // Create messages for Kafka
            const messages = pendingTasks.map((task) => {
                // Log the flow state to debug
                console.log(`Sending flow state ID: ${task.flowState.id}`);
                
                return {
                    key: task.flowState.flowId, // Using flowId as the key for partitioning
                    // Fix: Send the actual flowState.id instead of flowStateId property
                    value: JSON.stringify(task.flowState.id),
                    headers: {
                        'source': Buffer.from('outbox-sweeper'),
                        'timestamp': Buffer.from(Date.now().toString())
                    }
                };
            });
            
            // Only proceed if we have valid messages
            if (messages.length > 0) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages
                });
                
                // Delete processed entries from outbox ONLY AFTER successful Kafka send
                await txn.flowStateOutBox.deleteMany({
                    where: {
                        id: {
                            in: pendingTasks.map((task) => task.id)
                        }
                    }
                });

                console.log(`Successfully processed and removed ${pendingTasks.length} outbox entries`);
            } else {
                console.warn("No valid messages to send to Kafka");
            }
            
            await producer.disconnect();
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