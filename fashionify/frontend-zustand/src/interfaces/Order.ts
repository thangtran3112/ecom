/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import {
  OrderProductItemSchema,
  OrderSchema,
  PreOrderSchema,
} from "../zod/order-validation";

export type IPreOrder = z.infer<typeof PreOrderSchema>;

export type IOrder = z.infer<typeof OrderSchema>;

export type OrderProductItem = z.infer<typeof OrderProductItemSchema>;
