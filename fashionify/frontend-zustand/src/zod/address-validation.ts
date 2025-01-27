import { z } from "zod";

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
