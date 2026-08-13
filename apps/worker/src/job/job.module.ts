import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { JobController } from "./job.controller";
import { JobWorker } from "./job.worker";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 3000,
      },
    }),
    BullModule.registerQueue({
      name: "job",
    }),
  ],
  controllers: [JobController],
  providers: [JobWorker],
})
export class JobModule {}
