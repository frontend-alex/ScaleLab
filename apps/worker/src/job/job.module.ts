import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import {
  createRedisConnection,
  JOB_QUEUE_NAME,
  JOB_QUEUE_OPTIONS,
} from "@repo/queue";
import { JobController } from "./job.controller";
import { JobWorker } from "./job.worker";

@Module({
  imports: [
    BullModule.forRoot({
      connection: createRedisConnection(process.env.REDIS_URL),
      defaultJobOptions: JOB_QUEUE_OPTIONS,
    }),
    BullModule.registerQueue({
      name: JOB_QUEUE_NAME,
    }),
  ],
  controllers: [JobController],
  providers: [JobWorker],
})
export class JobModule {}
