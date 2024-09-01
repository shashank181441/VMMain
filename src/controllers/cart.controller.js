import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
  let { machineId, quantity } = req.body;
  let { productId } = req.params;

  // Validate request body
  if (![productId, machineId].every(Boolean)) {
    throw new ApiError(
      400,
      "Product ID, quantity, and machine ID are required."
    );
  }

  if (!quantity) {
    quantity = 1;
  }

  // Find the product by ID to ensure it exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available.");
  }

  // Check if an unpaid cart for the same machine and product already exists
  let cart = await Cart.findOne({ productId, machineId, paid: false }).populate(
    "productId"
  );

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

  product.stock -= quantity;
  await product.save();

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart successfully."));
});

// Get all cart items for a vending machine
const getCartItems = asyncHandler(async (req, res) => {
  const { machineId } = req.query;

  if (!machineId) {
    throw new ApiError(400, "Machine ID is required.");
  }

  const cartItems = await Cart.find({ machineId, paid: false }).populate(
    "productId"
  );

  if (!cartItems) {
    throw new ApiError(404, "No unpaid cart items found for this machine.");
  }

  return res
    .status(200)
    .json(
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

  // Increase the stock back when an item is removed from the cart
  const product = await Product.findById(cartItem.productId);
  if (product) {
    product.stock += cartItem.quantity;
    await product.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cartItem, "Cart item removed successfully."));
});

// Clear all cart items for a machine
const clearCart = asyncHandler(async (req, res) => {
  const { machineId } = req.params;

  const cartItems = await Cart.find({ machineId, paid: false });

  if (!cartItems.length) {
    throw new ApiError(404, "No unpaid cart found for this machine.");
  }

  // Increase the stock back for all items when the cart is cleared
  for (const cartItem of cartItems) {
    const product = await Product.findById(cartItem.productId);
    if (product) {
      product.stock += cartItem.quantity;
      await product.save();
    }
  }

  await Cart.deleteMany({ machineId, paid: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Cart cleared successfully."));
});

// Get unpaid carts by machine
const getUnpaidCartsByMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.query;

  if (!machineId) {
    throw new ApiError(400, "Machine ID is required.");
  }
  const unpaidCarts = await Cart.find({ machineId, paid: false }).populate(
    "productId"
  );
  if (!unpaidCarts.length) {
    throw new ApiError(404, "No unpaid carts found for this machine.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, unpaidCarts, "Unpaid carts retrieved successfully.")
    );
});

// Get unpaid carts by machine
const getPaidCartsByMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.params;

  if (!machineId) {
    throw new ApiError(400, "Machine ID is required.");
  }
  const unpaidCarts = await Cart.find({ machineId, paid: true }).populate(
    "productId"
  );
  if (!unpaidCarts.length) {
    throw new ApiError(404, "No unpaid carts found for this machine.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, unpaidCarts, "Unpaid carts retrieved successfully.")
    );
});

// Update cart item quantity and adjust product stock
const updateCartItems = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  const cartItem = await Cart.findById(cartItemId);
  console.log(cartItemId);

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found.");
  }

  const product = await Product.findById(cartItem.productId);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Adjust stock based on the new quantity
  const quantityDifference = quantity - cartItem.quantity;

  if (product.stock < quantityDifference) {
    throw new ApiError(400, "Not enough stock available.");
  }

  cartItem.quantity = quantity;
  product.stock -= quantityDifference;

  await cartItem.save();
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cartItem, "Cart item updated successfully."));
});

export {
  addToCart,
  getCartItems,
  removeCartItem,
  clearCart,
  getUnpaidCartsByMachine,
  getPaidCartsByMachine,
  updateCartItems,
};
