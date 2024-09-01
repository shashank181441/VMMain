import express from 'express';
import {
    finalizePayment,
    initiatePayment,
    // getPaymentsByMachine,
    // getPaymentsByCustomer,
    // getPaymentDetails
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/', initiatePayment);
router.post('/finalize', finalizePayment);


export default router;
