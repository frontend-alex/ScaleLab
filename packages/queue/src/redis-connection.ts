
import type { ConnectionOptions } from "bullmq";

export function createRedisConnection(
  redisUrl: string | undefined,
): ConnectionOptions {
  if (!redisUrl) {
    throw new Error("REDIS_URL is required to connect to BullMQ");
  }

  const url = new URL(redisUrl);

  const database = url.pathname.slice(1);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,

    ...(url.username && {
      username: decodeURIComponent(url.username),
    }),

    ...(url.password && {
      password: decodeURIComponent(url.password),
    }),

    ...(database && {
      db: Number(database),
    }),

    ...(url.protocol === "rediss:" && {
      tls: {},
    }),
  };
}
