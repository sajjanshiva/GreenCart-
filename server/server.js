import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './Configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './Configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/OrderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';


const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

//allow multiple origins
const allowedOrigins = ['http://localhost:5173']

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks );


//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins , credentials: true}));

app.get('/', (req, res) => {
    res.send('API is running');
})
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});