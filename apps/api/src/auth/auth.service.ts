import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { AuthContract, LoginOutput } from "@repo/contracts";
import { type Database, users } from "@repo/db";
import { eq } from "drizzle-orm";

import { env } from "../config/env";
import { InjectDatabase } from "../database/database.constant";

const scrypt = promisify(scryptCallback);
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  constructor(@InjectDatabase() private readonly db: Database) {}

  async register(body: AuthContract): Promise<void> {
    const [existingUser] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (existingUser) {
      throw new UnauthorizedException("Unable to create account");
    }

    await this.db.insert(users).values({
      email: body.email,
      password: await this.hashPassword(body.password),
    });
  }

  async login(body: AuthContract): Promise<LoginOutput> {
    const [user] = await this.db
      .select({
        id: users.id,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    const validPassword = user
      ? await this.verifyPassword(body.password, user.password)
      : false;

    if (!user || !validPassword) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return { token: this.createToken(user.id) };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `scrypt$${salt}$${derivedKey.toString("hex")}`;
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [algorithm, salt, storedKey] = storedHash.split("$");
    if (algorithm !== "scrypt" || !salt || !storedKey) return false;

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedKeyBuffer = Buffer.from(storedKey, "hex");

    return (
      derivedKey.length === storedKeyBuffer.length &&
      timingSafeEqual(derivedKey, storedKeyBuffer)
    );
  }

  private createToken(userId: string): string {
    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
    const header = encode({ alg: "HS256", typ: "JWT" });
    const payload = encode({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    });
    const signature = createHmac("sha256", env.JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    return `${header}.${payload}.${signature}`;
  }
}
