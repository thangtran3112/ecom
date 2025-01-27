import { z } from "zod";
import { AddressSchema } from "../zod/address-validation";

// Infer the type from the addressSchema
export type Address = z.infer<typeof AddressSchema>;
