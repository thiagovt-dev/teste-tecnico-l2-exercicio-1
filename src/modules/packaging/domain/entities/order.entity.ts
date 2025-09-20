import { Product } from './product.entity'

export class Order {
  constructor(readonly pedido_id: number, readonly produtos: Product[]) {}
}
