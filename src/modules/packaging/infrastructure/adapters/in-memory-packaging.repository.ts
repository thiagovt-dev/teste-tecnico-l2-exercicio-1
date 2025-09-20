import { PackagingRepository } from '../../domain/repositories/packaging.repository'
import { Order } from '../../domain/entities/order.entity'
import { BOXES } from './box-catalog.adapter'

export class InMemoryPackagingRepository implements PackagingRepository {
  
  pack(order: Order) {
    const boxes = BOXES.slice().sort((a, b) => a.volume() - b.volume())
    const items = order.produtos.slice().sort((a, b) => b.volume() - a.volume())
    const result: { id: string; usedVolume: number; products: string[]; dims: number[] }[] = []
    for (const p of items) {
      const fitsAny = boxes.some(b => p.dimensoes.fitsInto(b.dimensoes))
      if (!fitsAny) {
        result.push({ id: 'null', usedVolume: 0, products: [p.produto_id], dims: [0,0,0] })
        continue
      }
      let placed = false
      for (const r of result) {
        if (r.id === 'null') continue
        const b = boxes.find(x => x.caixa_id === r.id)!
        const remaining = b.volume() - r.usedVolume
        if (p.volume() <= remaining && p.dimensoes.fitsInto(b.dimensoes)) {
          r.products.push(p.produto_id)
          r.usedVolume += p.volume()
          placed = true
          break
        }
      }
      if (!placed) {
        const b = boxes.find(x => p.dimensoes.fitsInto(x.dimensoes))!
        result.push({ id: b.caixa_id, usedVolume: p.volume(), products: [p.produto_id], dims: [0,0,0] })
      }
    }
    return result.map(r => r.id === 'null'
      ? { caixa_id: null, produtos: r.products, observacao: 'Produto não cabe em nenhuma caixa disponível.' }
      : { caixa_id: r.id, produtos: r.products })
  }
}
