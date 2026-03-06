import amqplib from 'amqplib';

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('RabbitMQ connected ✅');

        // Handle connection errors
        connection.on('error', (err) => {
            console.log('RabbitMQ connection error:', err.message);
            reconnect();
        });

        connection.on('close', () => {
            console.log('RabbitMQ connection closed, reconnecting...');
            reconnect();
        });

    } catch (error) {
        console.log('RabbitMQ connection failed:', error.message);
        setTimeout(connectRabbitMQ, 5000); // retry after 5 seconds
    }
};

const reconnect = () => {
    setTimeout(connectRabbitMQ, 5000);
};

export const getChannel = () => channel;

export default connectRabbitMQ;