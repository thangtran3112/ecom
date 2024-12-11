import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import { PlaceOrderSchema, UpdateStatusSchema } from "../zod/order-validation";
import { IPreOrder } from "../interfaces/Order";
import Stripe from "stripe";
import { CURRENCY, DELIVERY_CHARGE, PaymentMethod } from "../common/constants";

// gateway initialize
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is not defined");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Placing orders using COD Method
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData: IPreOrder = {
      userId,
      items,
      address,
      amount,
      paymentMethod: PaymentMethod.Cod,
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

export const placeOrderStripe = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const parsedBody = PlaceOrderSchema.parse(req.body);

    const { userId, items, amount, address } = parsedBody;
    const { origin } = req.headers; // Origin is the frontend URL, where users submit the payment

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: PaymentMethod.Stripe,
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    const line_items = items.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.name,
        },
        //because stripe uses smallest currency as USD cents
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
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

/**
 * All Orders data for Admin Panel
 * @todo Add Pagination, skip, limit, filter, sort, etc
 * */
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
    // if (error instanceof z.ZodError) {
    //   // Handle validation errors
    //   return res.status(400).json({ success: false, errors: error.errors });
    // }
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
