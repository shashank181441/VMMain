import { asyncHandler } from "../utils/asyncHandler.js";
import { VendingMachine } from "../models/vendingMachine.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const createVendingMachine = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const userId = req.user._id;
  // TODO: Create vending machine logic here
  const newVending = await VendingMachine.create({ location, user: userId });

  const createdVending = await VendingMachine.findById(newVending._id).select(
    "-maintenance_details"
  );

  if (!createdVending) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdVending,
        "Vending Machine registered Successfully"
      )
    );
});

const updateVendingMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  const { location, status } = req.body;

  // Create an object with the fields to update
  const updateFields = {};

  if (location !== undefined) {
    updateFields.location = location;
  }

  if (status !== undefined) {
    updateFields.status = status;
  }

  const updatedVendingMachine = await VendingMachine.findByIdAndUpdate(
    machineId,
    updateFields, // Update both location and status
    { new: true }
  );

  if (!updatedVendingMachine) {
    throw new ApiError(500, "Vending Machine couldn't be updated.");
  }

  return res
    .status(200) // Changed status to 200 for successful updates
    .json(
      new ApiResponse(
        200,
        updatedVendingMachine,
        "Vending Machine updated successfully."
      )
    );
});

const getVendingMachinesByOwner = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // TODO: Get all vending machines for the owner (user)
  const machineByOwner = await VendingMachine.find({ user: userId }).select(
    "-merchantDetails -maintenance_details"
  );

  if (!machineByOwner) {
    throw new ApiError(500, "The user doesn't have a vending machine");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        machineByOwner,
        "The vending machines owned by user is fetched successfully"
      )
    );
});

const getVendingMachineDetails = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  // TODO: Get vending machine details
  const vending =
    await VendingMachine.findById(machineId).select("-merchantDetails");

  if (!vending) {
    throw new ApiError(500, "Vending machine not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        vending,
        "The vending machine details fetched successfully"
      )
    );
});

const addMaintenanceRecord = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  let { description, date } = req.body;

  if (!date) {
    let d = new Date();
    date = d.toDateString();
  }

  const newMaintenanceRecord = {
    maintenance_date: date,
    description,
  };

  const maintainedMachine = await VendingMachine.findByIdAndUpdate(
    machineId,
    { $push: { maintenance_details: newMaintenanceRecord } },
    { new: true }
  );

  if (!maintainedMachine) {
    throw new ApiError(404, "Couldn't find the updated machine.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        maintainedMachine,
        "The vending machine was updated successfully."
      )
    );
});

const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  // TODO: Get all maintenance records for a vending machine

  const vendingRecords =
    await VendingMachine.findById(machineId).select("-merchantDetails");

  if (!vendingRecords) {
    throw new ApiError(404, "Vending Machine not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        vendingRecords,
        "Records of previous maintenance fetched successfully. "
      )
    );
});

const deleteVendingMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.params;

  // Find and delete the vending machine
  const deletedMachine = await VendingMachine.findByIdAndDelete(machineId);

  if (!deletedMachine) {
    throw new ApiError(400, "Machine not found");
  }

  // Delete all products associated with the vending machine
  await Product.deleteMany({ machine: machineId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedMachine,
        "Machine and associated products deleted successfully."
      )
    );
});

export {
  createVendingMachine,
  updateVendingMachine,
  getVendingMachinesByOwner,
  getVendingMachineDetails,
  addMaintenanceRecord,
  getMaintenanceRecords,
  deleteVendingMachine,
};
