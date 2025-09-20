import { Injectable } from '@nestjs/common'
import { Order } from '../../domain/entities/order.entity'
import { PackResponse } from '../dto/pack-response.dto'
import { PackOrderUseCase } from '../use-cases/pack-order.usecase'

@Injectable()
export class PackagingService {
  constructor(private readonly uc: PackOrderUseCase) {}
  packMany(orders: Order[]): PackResponse {
    const pedidos = orders.map(o => ({ pedido_id: o.pedido_id, caixas: this.uc.execute(o) }))
    return { pedidos }
  }
}
