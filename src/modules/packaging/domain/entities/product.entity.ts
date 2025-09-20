import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Dimensions } from './dimensions'

export class Product {
  @IsString()
  produto_id: string
  @ValidateNested()
  @Type(() => Dimensions)
  dimensoes: Dimensions
  constructor(id: string, d: Dimensions) {
    this.produto_id = id
    this.dimensoes = d
  }
  
  volume() {
    return this.dimensoes.volume()
  }
}
