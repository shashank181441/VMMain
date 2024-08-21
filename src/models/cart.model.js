import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    machineId: {
        type: Schema.Types.ObjectId,
        ref: 'VendingMachine',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    paid: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
