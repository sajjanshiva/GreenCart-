

//place Order COD: api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";

//place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try{
        const {userId, items,address} = req.body;

        if(!address || items.length === 0){
            return res.json({success: false, message: "All fields are required"});
        }

        let amount = await items.reduce(async (acc, item) =>{
            const product = await Product.findById(item.product);
            return (await acc) + (product.offerPrice * item.quantity);
        },0);

        //Add Tax charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })

        res.json({success: true, message: "Order placed successfully"});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//place order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try{
        const userId = req.userId;
        const { items,address} = req.body;
        const {origin} = req.headers;


        if(!address || items.length === 0){
            return res.json({success: false, message: "All fields are required"});
        }
       
         let productData = [];
        

        let amount = await items.reduce(async (acc, item) =>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + (product.offerPrice * item.quantity);
        },0);

        //Add Tax charge (2%)
        amount += Math.floor(amount * 0.02);

       const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        //Stripe Gateway Initialization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price) * 100, //in cents
            },
            quantity: item.quantity,
        }
        });

        //Create Stripe Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        res.json({success: true, url: session.url});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Stripe Webhooks to Verify Payment Action: /stripe

export const stripeWebhooks = async (req, res) => {
     //Stripe Gateway Initialization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const sig = req.headers['stripe-signature'];
        let event;

        try{
            event = stripeInstance.webhooks.constructEvent(req.body, 
                sig,
                process.env.STRTPE_WEBHOOK_SECRET
            );
        }catch(err){
            console.log("Webhook Error", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        //Hnadle the event

        switch(event.type){
            case "payment_intent.succeeded":{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                //Getting Session Metadata
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const {orderId, userId} = session.data[0].metadata;

                //Mark payment as Paid
                await Order.findByIdAndUpdate(orderId,{isPaid: true});

                //Clear user cart
                await User.findOneAndUpdate({userId}, {cartItems: {}});

                break;
            }

                case "payment_intent.payment_failed":{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                //Getting Session Metadata
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const {orderId} = session.data[0].metadata;

                await Order.findByIdAndDelete(orderId);

                break;
                }
            

            default:
                console.error(`Unhandled event type ${event.type}`);
                break;
               
        }
        res.json({received: true});
}


//Get Orders by User ID : api/order/user

export const getUserOrders = async (req, res) => {
    try{
        const userId = req.userId;

        const orders = await Order.find({
            userId,
            $or : [{paymentType: "COD"}, {isPaid: true}]
        })
        .populate("items.product address")
        .sort({createdAt: -1});

        res.json({success: true, orders});


    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Get All Orders (for seller or admin): /api/order/seller

export const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({
            $or : [{paymentType: "COD"}, {isPaid: true}]
        })
        .populate("items.product address")
        .sort({createdAt: -1});
   
         res.json({success: true, orders});


    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}