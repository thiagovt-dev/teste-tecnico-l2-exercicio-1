import { Order } from '../entities/order.entity'

export interface PackagingRepository {
  pack(order: Order): { caixa_id: string | null; produtos: string[]; observacao?: string }[]
}
