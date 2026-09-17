import type { JobsOptions } from "bullmq";

export const JOB_QUEUE_NAME = "job";

export const JOB_QUEUE_OPTIONS: JobsOptions = {
  attempts: 3,
  removeOnComplete: 1000,
  removeOnFail: 3000,
};
