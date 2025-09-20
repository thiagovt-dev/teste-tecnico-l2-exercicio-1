import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PackagingService } from '../../application/services/packaging.service'
import { PackRequestDto } from '../../application/dto/pack-request.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../../shared/jwt-auth.guard'
import { Order } from '../../domain/entities/order.entity'
import { Product } from '../../domain/entities/product.entity'
import { Dimensions } from '../../domain/entities/dimensions'

@ApiTags('pack')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pack')
export class PackagingController {
  constructor(private readonly service: PackagingService) {}
  
  @Post()
  async pack(@Body() dto: PackRequestDto) {
    const orders = dto.pedidos.map(p => new Order(p.pedido_id, p.produtos.map(x => new Product(x.produto_id, new Dimensions(x.dimensoes.altura, x.dimensoes.largura, x.dimensoes.comprimento)))))
    return this.service.packMany(orders)
  }
}
