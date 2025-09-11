import express from 'express';
import { upload } from '../Configs/multer.js';
import authSeller from '../middlewares/AuthSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';
//add extension .js

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct); 
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock',authSeller, changeStock);

export default productRouter;