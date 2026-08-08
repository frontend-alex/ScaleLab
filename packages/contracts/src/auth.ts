import * as z from "zod";

export const authContract = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthContract = z.infer<typeof authContract>;
