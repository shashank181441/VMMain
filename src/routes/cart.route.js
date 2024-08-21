import express from 'express';
import {
    addToCart,
    getCartItems,
    removeCartItem,
    clearCart,
    getUnpaidCartsByMachine
} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/:cartItemId', removeCartItem);
router.delete('/:machineId/clear', clearCart);
router.get('/unpaid', getUnpaidCartsByMachine);

export default router;
