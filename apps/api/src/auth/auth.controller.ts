import { Body, Controller, Post } from "@nestjs/common";
import type { AuthContract } from "@repo/contracts";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() body: AuthContract) {
    this.authService;
  }

  @Post("/register")
  async register(@Body() body: AuthContract) {
    return this.authService.register(body);
  }
}
