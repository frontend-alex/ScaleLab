import { Injectable } from "@nestjs/common";
import type { AuthContract } from "@repo/contracts";
import { users, type Database } from "@repo/db";
import { eq } from "drizzle-orm";

import { InjectDatabase } from "../database/database.constant";

@Injectable()
export class AuthService {
  constructor(@InjectDatabase() private readonly db: Database) {}

  async register(body: AuthContract) {
    const { email } = body;

    const [existingUser] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new Error("User already exists");
    }
  }
}
