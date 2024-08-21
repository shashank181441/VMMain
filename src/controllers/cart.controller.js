import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";


// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => { 
    const { productId, quantity, machineId } = req.body;

    // Validate request body
    if (![productId, quantity, machineId].every(Boolean)) {
        throw new ApiError(400, "Product ID, quantity, and machine ID are required.");
    }

    // Find the product by ID to ensure it exists
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    // Check if an unpaid cart for the same machine and product already exists
    let cart = await Cart.findOne({ productId, machineId, paid: false });

    if (cart) {
        // If an unpaid cart already exists, update its quantity
        cart.quantity += quantity;
    } else {
        // Otherwise, create a new cart entry
        cart = await Cart.create({
            productId,
            machineId,
            quantity,
        });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product added to cart successfully.")
    );
});

// Get all cart items for a vending machine
const getCartItems = asyncHandler(async (req, res) => {
    const { machineId } = req.query;

    if (!machineId) {
        throw new ApiError(400, "Machine ID is required.");
    }

    const cartItems = await Cart.find({ machineId, paid: false }).populate('productId');

    if (!cartItems.length) {
        throw new ApiError(404, "No unpaid cart items found for this machine.");
    }

    return res.status(200).json(
        new ApiResponse(200, cartItems, "Cart items retrieved successfully.")
    );
});

// Remove a single item from the cart
const removeCartItem = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;

    const cartItem = await Cart.findByIdAndDelete(cartItemId);

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, cartItem, "Cart item removed successfully.")
    );
});

// Clear all cart items for a machine
const clearCart = asyncHandler(async (req, res) => {
    const { machineId } = req.params;

    const result = await Cart.deleteMany({ machineId, paid: false });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "No unpaid cart found for this machine.");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Cart cleared successfully.")
    );
});

// Get unpaid carts by machine
const getUnpaidCartsByMachine = asyncHandler(async (req, res) => {
    const { machineId } = req.query;

    if (!machineId) {
        throw new ApiError(400, "Machine ID is required.");
    }

    const unpaidCarts = await Cart.find({ machineId, paid: false }).populate('productId');

    if (!unpaidCarts.length) {
        throw new ApiError(404, "No unpaid carts found for this machine.");
    }

    return res.status(200).json(
        new ApiResponse(200, unpaidCarts, "Unpaid carts retrieved successfully.")
    );
});

const updateCartItems = asyncHandler(async (req, res)=>{
    const {cartId} = req.params;
    const {quantity} = req.body;
    const cartItem = await Cart.findByIdAndUpdate(cartId, {quantity}, {new: true});
    if(!cartItem){
        throw new ApiError(404, "Cart item not found.");
    }
    return res.status(200).json(
        new ApiResponse(200, cartItem, "Cart item updated successfully.")
    );
})

export {
    addToCart,
    getCartItems,
    removeCartItem,
    clearCart,
    getUnpaidCartsByMachine
};
