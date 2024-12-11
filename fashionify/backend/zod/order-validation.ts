import { z } from "zod";
import { OrderStatus } from "../common/constants";
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
