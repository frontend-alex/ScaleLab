import { ROUTES } from "@/config/routes";
import { api } from "@/lib/api-client";
import {
  type AuthContract,
  type RegisterResponse,
  RegisterResponseSchema,
} from "@repo/contracts";

export async function register(input: AuthContract): Promise<RegisterResponse> {
  const response = await api.post(ROUTES.AUTH.REGISTER, input);
  return RegisterResponseSchema.parse(response.data);
}
