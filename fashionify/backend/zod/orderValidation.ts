import { z } from "zod";
import { OrderStatus } from "../common/constants";

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

// Define the IProductOrderItem schema
const productOrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
});

// Define the address schema
export const AddressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  country: z.string(),
  phone: z.string(),
});

// Define the request body schema
export const PlaceOrderSchema = z.object({
  userId: z.string(),
  items: z.array(productOrderItemSchema),
  amount: z.number().positive(),
  address: AddressSchema,
});
