import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import {
  type AuthContract,
  authContractSchema,
  type LoginResponse,
  type RegisterResponse,
} from "@repo/contracts";
import type { Response } from "express";

import { ZodValidationPipe } from "../common/pipes/zod-validation";
import { env, NodeEnv } from "../config/env";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/register")
  async register(
    @Body(new ZodValidationPipe(authContractSchema)) body: AuthContract,
  ): Promise<RegisterResponse> {
    await this.authService.register(body);

    return {
      data: null,
      message: "Successfully created an account",
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(
    @Body(new ZodValidationPipe(authContractSchema)) body: AuthContract,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const { token } = await this.authService.login(body);

    response.cookie("auth", token, {
      httpOnly: true,
      secure: env.NODE_ENV === NodeEnv.Production,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      data: {
        token,
      },
      message: "Login successfully",
    };
  }
}
