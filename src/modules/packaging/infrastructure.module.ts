import { Module } from '@nestjs/common';
import { ControllersController } from './infrastructure/controllers.controller';
import { ServicesService } from './application/services.service';

@Module({
  controllers: [ControllersController],
  providers: [ServicesService]
})
export class InfrastructureModule {}
