import { Logger } from "@nestjs/common";
import { createApp } from "./create-app";
import { env } from "./config/env";

async function boostrap() {
  const app = await createApp();

  app.enableShutdownHooks();

  await app.listen(env.API_PORT);

  new Logger("Bootstrap").log({
    message: `Application is running on: http://localhost:${env.API_PORT}`,
    port: env.API_PORT,
    environment: env.NODE_ENV,
  });
}

void boostrap().catch((error: unknown) => {
  new Logger("Bootstrap").fatal(
    { message: "API failed to start" },
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
