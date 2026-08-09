import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_API_PORT: z.coerce.number().int().min(1).max(65535),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT,
});

export type WebEnvironment = z.infer<typeof envSchema>;
