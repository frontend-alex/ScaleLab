import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('job', { concurrency: 1 })
export class JobWorker extends WorkerHost {
  async process(job: Job) {
    const totalSteps = 5

    for(let step = 1; step <= totalSteps; step++) {
        // Simulate some work being done
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update job progress
        const progress = Math.round((step / totalSteps) * 100);
        await job.updateProgress(progress);
    }
  }

  @OnWorkerEvent("progress")
  onProgress(job: Job){
    console.log(`Job [PROGRESS]: ${job.id}, ${job.progress}% completed`)
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job [ACTIVE]: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job [COMPLETED]: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.log(`Job [FAILED]: ${job.id}, Error: ${error.message}`);
    console.log(`Job [FAILED]: ${job.id}, Attempts: ${job.attemptsMade}, Max Attempts: ${job.opts.attempts}`);
  }
}
