import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
import { orderLimiter } from '../middlewares/rateLimiter.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, orderLimiter, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, orderLimiter, placeOrderStripe);

export default orderRouter;