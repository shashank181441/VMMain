import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;

const vendingMachineSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    last_maintenance: {
      type: Date,
    },
    maintenance_details: [
      {
        maintenance_date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
        },
        performed_by: {
          type: String, // Storing technician details without user relationship
        },
      },
    ],
    user: {
      // Owner of the vending machine
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // merchantDetails: {
    //     merchant_code: { type: String, required: true },
    //     pan: { type: String, required: true },
    //     secret: { type: String, required: true },
    //     username: { type: String, required: true },
    //     password: { type: String, required: true },
    // },
  },
  { timestamps: true }
);

// Middleware to handle cascading delete of related products when a vending machine is removed
vendingMachineSchema.pre("remove", async function (next) {
  try {
    // 'this' refers to the vending machine being removed
    await Product.deleteMany({ machine: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware to encrypt merchantDetails fields if they've been modified
// vendingMachineSchema.pre('save', async function (next) {
//     const vendingMachine = this;

//     // Check if any merchant detail has been modified
//     if (vendingMachine.isModified('merchantDetails.merchant_code') ||
//         vendingMachine.isModified('merchantDetails.pan') ||
//         vendingMachine.isModified('merchantDetails.secret') ||
//         vendingMachine.isModified('merchantDetails.username') ||
//         vendingMachine.isModified('merchantDetails.password')) {

//         // Encrypt each of the fields using bcrypt
//         if (vendingMachine.isModified('merchantDetails.merchant_code')) {
//             vendingMachine.merchantDetails.merchant_code = await bcrypt.hash(vendingMachine.merchantDetails.merchant_code, SALT_ROUNDS);
//         }

//         if (vendingMachine.isModified('merchantDetails.pan')) {
//             vendingMachine.merchantDetails.pan = await bcrypt.hash(vendingMachine.merchantDetails.pan, SALT_ROUNDS);
//         }

//         if (vendingMachine.isModified('merchantDetails.secret')) {
//             vendingMachine.merchantDetails.secret = await bcrypt.hash(vendingMachine.merchantDetails.secret, SALT_ROUNDS);
//         }

//         if (vendingMachine.isModified('merchantDetails.username')) {
//             vendingMachine.merchantDetails.username = await bcrypt.hash(vendingMachine.merchantDetails.username, SALT_ROUNDS);
//         }

//         if (vendingMachine.isModified('merchantDetails.password')) {
//             vendingMachine.merchantDetails.password = await bcrypt.hash(vendingMachine.merchantDetails.password, SALT_ROUNDS);
//         }
//     }

//     next();
// });

export const VendingMachine = mongoose.model(
  "VendingMachine",
  vendingMachineSchema
);
