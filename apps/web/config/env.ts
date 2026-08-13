import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  API_URL: z.string().url(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
});

export type WebEnvironment = z.infer<typeof envSchema>;
