import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  setupSwagger(app)
  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  await app.listen(port, () =>{
    console.log(`Api is running on http://localhost:${port}`)
  })
}
bootstrap()
