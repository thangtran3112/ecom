import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import { z } from "zod";
import { UpdateStatusSchema } from "../zod/orderValidation";
import { IPreOrder } from "../interfaces/Order";

// Placing orders using COD Method
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData: IPreOrder = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear Cart Data, when user places order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Forntend
export const userOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
export const allOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const parsedBody = UpdateStatusSchema.parse(req.body);

    const { orderId, status } = parsedBody;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
