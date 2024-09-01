import express from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
  clearCart,
  getUnpaidCartsByMachine,
  updateCartItems,
  getPaidCartsByMachine,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/:productId", addToCart);
router.get("/", getCartItems);
router.delete("/:cartItemId", removeCartItem);
router.delete("/:machineId/clear", clearCart);
router.get("/unpaid", getUnpaidCartsByMachine);
router.get("/paid/:machineId", getPaidCartsByMachine);
router.patch("/:cartItemId", updateCartItems);

export default router;
