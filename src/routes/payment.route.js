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
// router.get('/machine', getPaymentsByMachine);
// router.get('/customer', getPaymentsByCustomer);
// router.get('/:paymentId', getPaymentDetails);


export default router;
