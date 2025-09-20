import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { INestApplication } from '@nestjs/common'
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('Empacotamento').setVersion('1.0').addBearerAuth().build()
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, doc)
}
