import express from 'express';
import { upload } from '../Configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', cacheMiddleware('all_products'), productList); // ✅ cached!
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;