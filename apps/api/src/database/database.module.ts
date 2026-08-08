import {
  Global,
  Injectable,
  Logger,
  Module,
  type OnApplicationShutdown,
  type OnModuleInit,
} from "@nestjs/common";
import { type Database, createDb } from "@repo/db";
import { env } from "../config/env";
import { DATABASE } from "./database.constant";

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
    
  private readonly client = createDb(env.DATABASE_URL);
  private readonly logger = new Logger(DatabaseService.name);

  get db(): Database {
    return this.client.db;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.pool.query("select 1");

      this.logger.log("Database connected");

    } catch (error) {
      this.logger.fatal(
        "Database connection failed",
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    await this.client.pool.end();
    this.logger.log(`Database disconnected${signal ? ` (${signal})` : ""}`);
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DATABASE,
      inject: [DatabaseService],
      useFactory: (database: DatabaseService) => database.db,
    },
  ],
  exports: [DATABASE, DatabaseService],
})
export class DatabaseModule {}
