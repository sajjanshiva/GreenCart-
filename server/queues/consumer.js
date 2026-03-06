import { getChannel } from '../Configs/rabbitmq.js';
import { processEmailJob } from '../workers/emailWorker.js';

const ORDER_QUEUE = 'order_confirmation';

export const startConsumer = async () => {
    try {
        // Retry until channel is ready
        let channel = getChannel();

        let retries = 0;

        while (!channel && retries < 5) {
            console.log('Waiting for RabbitMQ channel...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            channel = getChannel();
            retries++;
        }

        if (!channel) {
            console.log('RabbitMQ channel not available after retries');
            return;
        }

        await channel.assertQueue(ORDER_QUEUE, { durable: true });
        channel.prefetch(1);

        console.log('Consumer waiting for jobs... 🐇');

        channel.consume(ORDER_QUEUE, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    console.log('Job received from queue:', data.orderId);

                    await processEmailJob(data);

                    channel.ack(msg);
                    console.log('Job completed ✅');

                } catch (error) {
                    console.log('Consumer error:', error.message);
                    channel.nack(msg, false, true);
                }
            }
        });

    } catch (error) {
        console.log('Consumer start error:', error.message);
    }
};