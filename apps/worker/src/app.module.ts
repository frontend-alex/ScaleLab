import { Module } from "@nestjs/common";
import { AppController } from "./hello/app.controller";
import { AppService } from "./hello/app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
