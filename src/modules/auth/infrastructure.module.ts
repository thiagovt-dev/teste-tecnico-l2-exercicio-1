import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure.controller';
import { ServicesService } from './application/services.service';

@Module({
  controllers: [InfrastructureController],
  providers: [ServicesService]
})
export class InfrastructureModule {}
