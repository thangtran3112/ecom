import mongoose from "mongoose";

export const MinimumCounterValue = 9999;

/**
 * Counter schema to keep track of the sequence value
 * Instead of using random id for orders, we can use a sequence value
 */
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: MinimumCounterValue },
});

const counterModel = mongoose.model("counter", counterSchema);
export default counterModel;
