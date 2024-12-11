import express from "express";
import { adminAuth } from "../middleware/adminAuth";
import authUser from "../middleware/auth";
import { placeOrder, userOrders } from "../controllers/orderController";

const orderRouter = express.Router();

// Admin Features
// orderRouter.post("/list", adminAuth, allOrders);
// orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
// orderRouter.post("/stripe", authUser, placeOrderStripe);
// orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// // verify payment
// orderRouter.post("/verifyStripe", authUser, verifyStripe);
// orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

export default orderRouter;
