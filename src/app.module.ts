import { Module } from '@nestjs/common'
import { PackageModule } from './modules/packaging/infrastructure/package.module'
import { AuthModule } from './modules/auth/infrastructure/auth.module'
import { AppController } from './app.controller'

@Module({
  imports: [AuthModule, PackageModule],
  controllers: [AppController]
})
export class AppModule {}
