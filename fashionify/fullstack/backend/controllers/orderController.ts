import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";

// Placing orders using COD Method
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
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

// update order status from Admin Panel
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
