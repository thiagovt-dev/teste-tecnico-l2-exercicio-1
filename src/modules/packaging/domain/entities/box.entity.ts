import { Dimensions } from './dimensions'

export class Box {
  constructor(readonly caixa_id: string, readonly dimensoes: Dimensions) {}
  volume() {
    return this.dimensoes.volume()
  }
}
