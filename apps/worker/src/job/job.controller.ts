import { Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('job')
export class JobController {
  constructor(@InjectQueue('job') private readonly jobQueue: Queue) {}

  @Post('add-job')
  async getHello(): Promise<{ message: string }> {
    await this.jobQueue.add(
      'my-job',
      { foo: 'bar' },
    );
    
    return {
      message: 'Job added to the queue',
    };
  }
}
