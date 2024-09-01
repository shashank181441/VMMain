import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendingMachine",
      required: true,
    },
    productNumber: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: String,
    image_url: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
