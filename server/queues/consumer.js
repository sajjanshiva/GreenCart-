import { getChannel } from '../Configs/rabbitmq.js';
import { processEmailJob } from '../workers/emailWorker.js';

const ORDER_QUEUE = 'order_confirmation';

export const startConsumer = async () => {
    try {
        const channel = getChannel();

        if (!channel) {
            console.log('RabbitMQ channel not ready');
            return;
        }

        // Make sure queue exists
        await channel.assertQueue(ORDER_QUEUE, { durable: true });

        // Process one message at a time
        channel.prefetch(1);

        console.log('Consumer waiting for jobs... 🐇');

        // Listen for jobs
        channel.consume(ORDER_QUEUE, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    console.log('Job received from queue:', data.orderId);

                    // Process the job
                    await processEmailJob(data);

                    // Acknowledge job is done
                    channel.ack(msg);
                    console.log('Job completed ✅');

                } catch (error) {
                    console.log('Consumer error:', error.message);
                    // Reject and requeue
                    channel.nack(msg, false, true);
                }
            }
        });

    } catch (error) {
        console.log('Consumer start error:', error.message);
    }
};