import { z } from "zod";

// Define the IProduct schema
export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  image: z.array(z.string()), // Assuming image is an array of strings (URLs or paths)
  category: z.string(),
  subCategory: z.string(),
  sizes: z.array(z.string()), // Assuming sizes is an array of strings
  bestseller: z.boolean(), // Optional field
  date: z.number(),
});

// Define the IProductOrderItem schema
export const ProductOrderItemSchema = ProductSchema.extend({
  size: z.string(),
  quantity: z.number().int().positive(),
});
