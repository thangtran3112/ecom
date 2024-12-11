import { z } from "zod";
import { OrderStatus } from "../models/orderModel";

/**
 * Validate the request body for updating the order status
 */
export const UpdateStatusSchema = z.object({
  orderId: z.string(),
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
