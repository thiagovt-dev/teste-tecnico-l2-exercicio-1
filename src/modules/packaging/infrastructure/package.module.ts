import { Module } from '@nestjs/common'
import { PackagingController } from './controllers/packaging.controller'
import { PackagingService } from '../application/services/packaging.service'
import { PackOrderUseCase } from '../application/use-cases/pack-order.usecase'
import { InMemoryPackagingRepository } from './adapters/in-memory-packaging.repository'

@Module({
  controllers: [PackagingController],
  providers: [
    PackagingService,
    PackOrderUseCase,
    { provide: 'PackagingRepository', useClass: InMemoryPackagingRepository }
  ]
})
export class PackageModule {}
