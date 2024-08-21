import mongoose, { Schema } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { VendingMachine } from "../models/vendingMachine.model.js";
import crypto from "crypto";
import axios from "axios";

const initiatePayment = asyncHandler(async (req, res) => {
    const { machineId } = req.body;

    // Fetch the vending machine and user associated with it
    const machine = await VendingMachine.findById(machineId);
    if (!machine) {
        throw new ApiError(404, "Machine not found");
    }

    const user = await User.findById(machine.user).select("-password -email");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Fetch unpaid carts related to the vending machine
    const unpaidCarts = await Cart.find({ machineId, paid: false }).populate('productId');
    if (unpaidCarts.length === 0) {
        throw new ApiError(404, "No unpaid carts found");
    }

    // Calculate total price of all items in the cart
    let totalAmount = 0;
    unpaidCarts.map((upcart) => {
        totalAmount += upcart.productId.price * upcart.quantity;
    });

    // Use user’s merchant details for initiating payment
    const { merchant_code, pan, secret, username, password } = user.merchantDetails;

    // Initiate payment via QR code
    const prn = Date.now();
    const remarks1 = JSON.stringify(unpaidCarts.map(cart => cart.productId.name));
    const remarks2 = req.body.remarks2 || "test 2";

    const data = `${totalAmount},${merchant_code},${prn},${remarks1},${remarks2},`;

    // Function to generate SHA512 HMAC
    function generateSha512Hmac(data, secret) {
        return crypto.createHmac('sha512', secret).update(data).digest('hex');
    }

    const dataValidation = generateSha512Hmac(data, secret);

    try {
        const response = await axios.post('https://merchantapi.fonepay.com/api/merchant/merchantDetailsForThirdParty/thirdPartyDynamicQrDownload', {
            amount: totalAmount,
            remarks1: remarks1,
            remarks2: remarks2,
            prn: prn,
            merchantCode: merchant_code,
            dataValidation: dataValidation,
            username: username,
            password: password
        });

        // Send the QR Code and WebSocket URL to the frontend
        return res.status(200).json(
            new ApiResponse(200, {
                qrMessage: response.data.qrMessage || "qrmessage",
                wsUrl: response.data.merchantWebSocketUrl || "wsurl",
                prn: prn // Send PRN back to the client
            }, "Payment initiated and QR code generated successfully.")
        );

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error initiating payment.");
    }
});





const hello = asyncHandler(async (req, res) => {
console.log(await req.user);
const hell = {}
return res.status(200).json(
    new ApiResponse(200, hell, "hello")
);
})
const listenForPayment = async (req, res) => {
    const wsUrl = req.body.wsUrl;

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log('WebSocket connection opened');
    });

    ws.on('message', (message) => {
        const decodedMessage = message.toString('utf8');
        try {
            const jsonData = JSON.parse(decodedMessage);
            console.log('Decoded WebSocket message:', jsonData);
            res.json(jsonData); // Send the decoded WebSocket message to the client


        } catch (error) {
            console.error('Failed to parse WebSocket message as JSON:', error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
};

const finalizePayment = asyncHandler(async (req, res) => {
    const { machineId } = req.body;

    // Fetch the vending machine and user associated with it
    const machine = await VendingMachine.findById(machineId);
    if (!machine) {
        throw new ApiError(404, "Machine not found");
    }

    const user = await User.findById(machine.user).select("-password -email");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Fetch unpaid carts related to the vending machine
    const unpaidCarts = await Cart.find({ machineId, paid: false }).populate('productId');
    if (unpaidCarts.length === 0) {
        throw new ApiError(404, "No unpaid carts found");
    }

    // Calculate total price of all items in the cart
    let totalAmount = 0;
    unpaidCarts.map((upcart) => {
        totalAmount += upcart.productId.price * upcart.quantity;
    });

    // Create payment record
    const payment = new Payment({
        carts: unpaidCarts.map(cart => cart._id), // Add cart IDs to the payment
        machine: machineId,
        total_amount: totalAmount,
        payment_status: "successful", // Assuming payment is successful
        payment_time: Date.now(),
    });

    await payment.save();

    // Mark carts as paid
    await Cart.updateMany({ machineId, paid: false }, { $set: { paid: true } });

    // Send the payment confirmation response to the frontend
    return res.status(200).json(
        new ApiResponse(200, payment, "Payment recorded successfully and carts updated.")
    );
});


// const getPaymentsByMachine = asyncHandler(async (req, res) => {
//     const { machineId } = req.query;
//     // TODO: Get all payments for a vending machine
// });

// const getPaymentsByCustomer = asyncHandler(async (req, res) => {
//     const { customerId } = req.query;
//     // TODO: Get all payments by a customer
// });

// const getPaymentDetails = asyncHandler(async (req, res) => {
//     const { paymentId } = req.params;
//     // TODO: Get details of a specific payment
// });

export {
    initiatePayment, finalizePayment
    // getPaymentDetails, getPaymentsByCustomer, getPaymentsByMachine
}