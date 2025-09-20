import { PackOrderUseCase } from './pack-order.usecase'
import { InMemoryPackagingRepository } from '../../infrastructure/adapters/in-memory-packaging.repository'
import { Order } from '../../domain/entities/order.entity'
import { Product } from '../../domain/entities/product.entity'
import { Dimensions } from '../../domain/entities/dimensions'

describe('PackOrderUseCase', () => {
  it('packs products minimizing number of boxes', () => {
    const repo = new InMemoryPackagingRepository()
    const uc = new PackOrderUseCase(repo as any)
    const order = new Order(1, [
      new Product('PS5', new Dimensions(40,10,25)),
      new Product('Volante', new Dimensions(40,30,30))
    ])
    const caixas = uc.execute(order)
    expect(caixas.length).toBeGreaterThan(0)
  })
})
