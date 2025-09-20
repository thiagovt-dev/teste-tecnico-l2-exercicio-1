import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PackagingController } from './controllers/packaging.controller'
import { PackagingService } from '../application/services/packaging.service'
import { PackOrderUseCase } from '../application/use-cases/pack-order.usecase'
import { InMemoryPackagingRepository } from './adapters/in-memory-packaging.repository'
import { PACKING_POLICY } from './policies/packing.policy'
import { packingPolicyFactory } from './policies/packing-policy.factory'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [PackagingController],
  providers: [
    PackagingService,
    PackOrderUseCase,
    {
      provide: PACKING_POLICY,
      useFactory: packingPolicyFactory,
      inject: [ConfigService],
    },
    { provide: 'PackagingRepository', useClass: InMemoryPackagingRepository }
  ]
})
export class PackageModule {}
