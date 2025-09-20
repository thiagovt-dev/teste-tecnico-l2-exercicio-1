import { Type } from 'class-transformer'
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator'

class DimDto {
  @IsInt()
  altura!: number
  @IsInt()
  largura!: number
  @IsInt()
  comprimento!: number
}

class ProdutoDto {
  @IsString()
  produto_id!: string
  @ValidateNested()
  @Type(() => DimDto)
  dimensoes!: DimDto
}

class PedidoDto {
  @IsInt()
  pedido_id!: number
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos!: ProdutoDto[]
}

export class PackRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  pedidos!: PedidoDto[]
}
