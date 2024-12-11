import { z } from "zod";
import { OrderStatus, PaymentMethod } from "../common/constants";
import { ProductOrderItemSchema } from "./product-validation";
import { AddressSchema } from "./address-validation";

/**
 * Validate the request body for updating the order status
 */
export const UpdateStatusSchema = z.object({
  orderId: z.number(),
  status: z.nativeEnum(OrderStatus, {
    errorMap: (issue, _ctx) => {
      if (issue.code === "invalid_enum_value") {
        return {
          message: `Invalid status. Must be one of: ${Object.values(
            OrderStatus
          ).join(", ")}`,
        };
      }
      return { message: "Invalid status" };
    },
  }),
});

// Define the request body schema
export const PlaceOrderSchema = z.object({
  userId: z.string(),
  items: z.array(ProductOrderItemSchema),
  amount: z.number().positive(),
  address: AddressSchema,
});

// Define the PaymentMethod schema
export const PaymentMethodSchema = z.nativeEnum(PaymentMethod);

// Define the IPreOrder schema
export const PreOrderSchema = z.object({
  payment: z.boolean(),
  userId: z.string(),
  items: z.array(ProductOrderItemSchema),
  amount: z.number().positive(),
  address: AddressSchema,
  paymentMethod: PaymentMethodSchema,
  date: z.number(),
});

// Define the OrderStatus schema
export const OrderStatusSchema = z.nativeEnum(OrderStatus);

// Define the IOrder schema
export const OrderSchema = PreOrderSchema.extend({
  _id: z.string().optional(),
  status: OrderStatusSchema,
});

// Define the OrderProductItem schema
export const OrderProductItemSchema = ProductOrderItemSchema.extend({
  status: z.string(),
  payment: z.boolean(),
  paymentMethod: z.string(),
  date: z.number(),
});
