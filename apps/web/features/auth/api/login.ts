import { ROUTES } from "@/config/routes";
import { api } from "@/lib/api-client";
import {
  type AuthContract,
  LoginResponseSchema,
  type LoginResponse,
} from "@repo/contracts";

export async function login(input: AuthContract): Promise<LoginResponse> {
  const response = await api.post(ROUTES.AUTH.LOGIN, input);
  return LoginResponseSchema.parse(response.data);
}
