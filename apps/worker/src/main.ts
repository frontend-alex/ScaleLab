import "@repo/env/load";

import { Logger } from "@nestjs/common";
import { createApp } from "./create-app";

async function boostrap() {
  const app = await createApp();

  app.enableShutdownHooks();

  const port = Number(process.env.WORKER_PORT);
  await app.listen(port);

  new Logger("Bootstrap").log({
    message: "Worker application started",
    port: Number(port),
    environment: process.env.NODE_ENV,
  });
}

void boostrap().catch((error: unknown) => {
  new Logger("Bootstrap").fatal(
    { message: "API failed to start" },
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
