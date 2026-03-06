import { getChannel } from '../Configs/rabbitmq.js';

const ORDER_QUEUE = 'order_confirmation';

export const sendToQueue = async (data) => {
    try {
        const channel = getChannel();

        if (!channel) {
            console.log('RabbitMQ channel not ready');
            return;
        }

        // Make sure queue exists
        await channel.assertQueue(ORDER_QUEUE, { durable: true });

        // Push job to queue
        channel.sendToQueue(
            ORDER_QUEUE,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );

        console.log('Job pushed to queue:', ORDER_QUEUE);

    } catch (error) {
        console.log('Producer error:', error.message);
    }
};