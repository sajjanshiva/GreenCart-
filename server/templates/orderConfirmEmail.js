const orderConfirmEmail = ({ orderId, items, amount, address, paymentType }) => {
    const itemRows = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:right;">₹${item.product.offerPrice * item.quantity}</td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 GreenCart</h1>
            <p style="color: white; margin: 5px 0;">Order Confirmed!</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <h2 style="color: #333;">Thank you for your order! 🎉</h2>
            <p style="color: #666;">Your order has been placed successfully.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="margin: 8px 0;"><strong>Payment:</strong> ${paymentType}</p>
                <p style="margin: 0;"><strong>Delivery to:</strong> ${address.street}, ${address.city}, ${address.state}</p>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th style="padding: 10px; text-align:left;">Product</th>
                        <th style="padding: 10px; text-align:center;">Qty</th>
                        <th style="padding: 10px; text-align:right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                </tbody>
            </table>

            <!-- Total -->
            <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee;">
                <h3 style="color: #4CAF50;">Total: ₹${amount}</h3>
            </div>

            <p style="color: #666; margin-top: 30px;">We'll notify you when your order is on its way!</p>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 15px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2025 GreenCart. All rights reserved.</p>
        </div>

    </div>
    `;
};

export default orderConfirmEmail;