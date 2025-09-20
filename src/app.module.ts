import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './modules/auth/infrastructure.module';
import { InfrastructureModule } from './modules/packaging/infrastructure.module';
import { SharedModule } from './modules/shared.module';

@Module({
  imports: [InfrastructureModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
