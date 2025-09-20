import { Inject, Injectable } from '@nestjs/common'
import { PackagingRepository } from '../../domain/repositories/packaging.repository'
import { Order } from '../../domain/entities/order.entity'

@Injectable()
export class PackOrderUseCase {
  constructor(
    @Inject('PackagingRepository') private readonly repo: PackagingRepository
  ) {}
  execute(order: Order) {
    return this.repo.pack(order)
  }
}
