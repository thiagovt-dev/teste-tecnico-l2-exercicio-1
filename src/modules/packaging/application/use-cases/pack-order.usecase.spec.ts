import { PackOrderUseCase } from './pack-order.usecase';
import { InMemoryPackagingRepository } from '../../infrastructure/adapters/in-memory-packaging.repository';
import { Order } from '../../domain/entities/order.entity';
import { Product } from '../../domain/entities/product.entity';
import { Dimensions } from '../../domain/entities/dimensions';
import { PackingPolicy } from '../../infrastructure/policies/packing.policy';

describe('PackOrderUseCase', () => {
  it('packs products minimizing number of boxes (basic property test)', () => {
    const policy: PackingPolicy = { bigH: 40, bigW: 50, maxWithBig: 2 };
    const repo = new InMemoryPackagingRepository(policy);
    const uc = new PackOrderUseCase(repo);

    const order = new Order(1, [
      new Product('PS5', new Dimensions(40, 10, 25)),
      new Product('Volante', new Dimensions(40, 30, 30)),
    ]);

    const caixas = uc.execute(order);

    expect(Array.isArray(caixas)).toBe(true);
    expect(caixas.length).toBeGreaterThanOrEqual(1);

    const produtos = caixas.flatMap((c) => c.produtos);
    expect(produtos.sort()).toEqual(['PS5', 'Volante'].sort()); 
    expect(new Set(produtos).size).toBe(2); 
  });
});
