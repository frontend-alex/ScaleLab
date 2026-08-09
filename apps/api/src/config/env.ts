import "@repo/env/load";

import { plainToInstance, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from "class-validator";

export enum NodeEnv {
  Development = "development",
  Production = "production",
  Test = "test",
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  API_PORT = 3001;

  @IsString()
  @MinLength(1, {
    message:
      "DATABASE_URL is required. `docker compose up -d` starts one, or set it to any Postgres connection string.",
  })
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32, {
    message: "JWT_SECRET must be at least 32 characters long.",
  })
  JWT_SECRET!: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: false,
  });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(", "))
      .join("\n  - ");

    throw new Error(
      `Invalid environment configuration:\n  - ${details}\n\nSee .env.example at the root of the repo.`,
    );
  }

  return validated;
}

export const env = validateEnv(process.env);
