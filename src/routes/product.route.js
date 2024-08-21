import express from 'express';
import {
    createProduct,
    updateProduct,
    getProducts,
    getProductDetails,
    deleteProduct
} from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', 
upload.fields([
    {
        name: "image_url",
        maxCount: 1
    },
]),createProduct);
router.patch('/:productId', updateProduct);
router.get('/', getProducts);
router.get('/:productId', getProductDetails);
router.delete('/:productId', deleteProduct);

export default router;
