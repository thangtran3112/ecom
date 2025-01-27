import { z } from "zod";
import {
  ProductOrderItemSchema,
  ProductSchema,
} from "../zod/product-validation";

export type IProduct = z.infer<typeof ProductSchema>;

export type IProductOrderItem = z.infer<typeof ProductOrderItemSchema>;
