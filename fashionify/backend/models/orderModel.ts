import mongoose from "mongoose";
import counterModel, { MinimumCounterValue } from "./counterModel";
import { OrderStatus } from "../common/constants";

const orderSchema = new mongoose.Schema({
  // _id: { type: Number, required: true }, // if using random id for order._id
  _id: { type: Number, required: false },
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: OrderStatus.OrderPlaced },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
});

// Pre-save hook to increment the sequence value
orderSchema.pre("save", async function (next) {
  const order = this;
  if (order.isNew) {
    try {
      const counter = await counterModel.findByIdAndUpdate(
        { _id: "orderId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      if (counter) {
        order._id = counter.seq;
      } else {
        // If counter is not found, initialize it with seq 9999
        const newCounter = await counterModel.create({
          _id: "orderId",
          seq: MinimumCounterValue,
        });
        order._id = newCounter.seq + 1;
      }
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
