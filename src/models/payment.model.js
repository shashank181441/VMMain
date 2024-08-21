import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
    ],
    machine: {
        type: Schema.Types.ObjectId,
        ref: 'VendingMachine',
        required: true,
    },
    deviceId: {
        type: String,
        
    },
    total_amount: {
        type: Number,
        required: true,
    },
    payment_status: {
        type: String,
        enum: ['successful', 'failed'],
        default: 'successful',
    },
    payment_time: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
