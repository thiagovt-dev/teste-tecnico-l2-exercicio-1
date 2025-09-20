import { Box } from '../../domain/entities/box.entity'
import { Dimensions } from '../../domain/entities/dimensions'

export const BOXES: Box[] = [
  new Box('Caixa 1', new Dimensions(30, 40, 80)),
  new Box('Caixa 2', new Dimensions(50, 50, 40)),
  new Box('Caixa 3', new Dimensions(50, 80, 60))
]
