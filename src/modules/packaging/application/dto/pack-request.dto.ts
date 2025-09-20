import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DimDto {
  @ApiProperty({ description: 'Altura do produto em centímetros', example: 40 })
  @IsInt()
  altura!: number;

  @ApiProperty({ description: 'Largura do produto em centímetros', example: 10 })
  @IsInt()
  largura!: number;

  @ApiProperty({
    description: 'Comprimento do produto em centímetros',
    example: 25,
  })
  @IsInt()
  comprimento!: number;
}

class ProdutoDto {
  @ApiProperty({ description: 'ID único do produto', example: 'PS5' })
  @IsString()
  produto_id!: string;

  @ApiProperty({
    description: 'Dimensões do produto',
    type: DimDto,
  })
  @ValidateNested()
  @Type(() => DimDto)
  dimensoes!: DimDto;
}

class PedidoDto {
  @ApiProperty({ description: 'ID único do pedido', example: 1 })
  @IsInt()
  pedido_id!: number;

  @ApiProperty({
    description: 'Lista de produtos no pedido',
    type: [ProdutoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos!: ProdutoDto[];
}

export class PackRequestDto {
  @ApiProperty({
    description: 'Lista de pedidos a serem empacotados',
    type: [PedidoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  pedidos!: PedidoDto[];
}