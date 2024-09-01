import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, machineId, productNumber } = req.body;
  console.log({ name, price, category, machineId, productNumber });
  // TODO: Add a new product to the vending machine
  if (
    [name, price, category, machineId, productNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedProduct = await Product.findOne({ name, machine: machineId });

  if (existedProduct) {
    throw new ApiError(400, "Product already exists");
  }

  const imageLocalPath = req.files?.image_url[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image_url = await uploadOnCloudinary(imageLocalPath);

  if (!image_url) {
    throw new ApiError(400, "Avatar file is required");
  }

  const product = await Product.create({
    name,
    category,
    machine: machineId,
    price,
    image_url: image_url.url,
    productNumber,
  });

  if (!product) {
    throw new ApiError(500, "Product couldn't be uploaded for some reason.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product added succesfully."));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, category, productNumber, stock, active } = req.body;
  console.log(req.body);

  // Check if the product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Update the product details
  if (name) product.name = name.trim();
  if (price) product.price = price;
  if (category) product.category = category.trim();
  if (stock) product.stock = stock;
  if (productNumber) product.productNumber = productNumber;
  if (active) product.active = active;

  // Check if there is a new image to update
  if (req.files?.image_url?.length > 0) {
    const imageLocalPath = req.files?.image_url[0].path;
    const image_url = await uploadOnCloudinary(imageLocalPath);
    product.image_url = image_url?.url || product.image_url;
  }

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully."));
});

const getProducts = asyncHandler(async (req, res) => {
  const { machineId } = req.query;

  // Check if the machineId is provided
  if (!machineId?.trim()) {
    throw new ApiError(400, "Machine ID is required");
  }

  // Get all products associated with the vending machine
  const products = await Product.find({ machine: machineId, active: true });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully."));
});

const getProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find the product by its ID
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product details retrieved successfully.")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find and delete the product
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedProduct, "Product deleted successfully.")
    );
});

export {
  createProduct,
  updateProduct,
  getProducts,
  getProductDetails,
  deleteProduct,
};
