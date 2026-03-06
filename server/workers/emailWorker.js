import sendEmail from '../utils/sendEmail.js';
import orderConfirmEmail from '../templates/orderConfirmEmail.js';

export const processEmailJob = async (data) => {
    try {
        const { to, orderId, items, amount, address, paymentType } = data;

        console.log('Processing email job for:', to);

        await sendEmail({
            to,
            subject: paymentType === 'COD' 
                ? "Order Confirmed - GreenCart 🛒" 
                : "Payment Confirmed - GreenCart 🛒",
            html: orderConfirmEmail({
                orderId,
                items,
                amount,
                address,
                paymentType
            })
        });

        console.log('Email sent successfully to:', to);

    } catch (error) {
        console.log('Email worker error:', error.message);
        throw error; // rethrow so consumer can nack the message
    }
};