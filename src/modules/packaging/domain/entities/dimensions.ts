import { IsInt, IsPositive } from 'class-validator'

export class Dimensions {
  @IsInt()
  @IsPositive()
  altura: number
  @IsInt()
  @IsPositive()
  largura: number
  @IsInt()
  @IsPositive()
  comprimento: number
  constructor(a: number, l: number, c: number) {
    this.altura = a
    this.largura = l
    this.comprimento = c
  }

  volume() {
    return this.altura * this.largura * this.comprimento
  }
  
  fitsInto(box: Dimensions) {
    const p = [this.altura, this.largura, this.comprimento].sort((x, y) => x - y)
    const b = [box.altura, box.largura, box.comprimento].sort((x, y) => x - y)
    return p[0] <= b[0] && p[1] <= b[1] && p[2] <= b[2]
  }
}
