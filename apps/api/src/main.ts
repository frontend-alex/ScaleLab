import { Logger } from "@nestjs/common";
import { createApp } from "./create-app";
import { env } from "./config/env";

async function boostrap() {
  const app = await createApp();

  app.enableShutdownHooks();

  const port = Number(env.API_PORT);
  await app.listen(port);

  new Logger("Bootstrap").log({
    message: "API application started",
    port,
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
