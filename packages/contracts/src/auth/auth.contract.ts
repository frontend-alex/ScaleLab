import * as z from "zod";
import { apiResponseSchema } from "../common/api.contract.js";

//Both register and login IN contract
export const authContractSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthContract = z.infer<typeof authContractSchema>;

// Register OUT Contract
export const RegisterOutputSchema = z.null();
export const RegisterResponseSchema = apiResponseSchema(RegisterOutputSchema);
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Login OUT contrac
export const LoginOutputSchema = z.object({
  token: z.string(),
});
export type LoginOutput = z.infer<typeof LoginOutputSchema>;
export const LoginResponseSchema = apiResponseSchema(LoginOutputSchema);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
