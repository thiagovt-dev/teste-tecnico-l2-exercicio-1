export type PackResponse = {
  pedidos: { pedido_id: number; caixas: { caixa_id: string | null; produtos: string[]; observacao?: string }[] }[]
}
