import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { INestApplication } from '@nestjs/common'
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('API Empacotamento')
  .setVersion('v0.1.0')
  .setDescription(`
    API de Empacotamento Inteligente
    
    Sistema de empacotamento otimizado desenvolvido como solução para o Exercício 1 do teste técnico para a vaga de Desenvolvedor Node.js Pleno na L2 Code.
    
    Funcionalidades:
    • Autenticação JWT segura para acesso às rotas protegidas
    • Algoritmo de empacotamento que otimiza o uso de caixas disponíveis
    • API RESTful com documentação interativa via Swagger
    • Arquitetura limpa seguindo princípios de Clean Architecture
    
    Tecnologias:
    • NestJS - Framework Node.js robusto e escalável
    • TypeScript - Tipagem estática para maior confiabilidade
    • JWT - Autenticação stateless
    • Swagger/OpenAPI - Documentação automática da API
    
    Desenvolvedor:
    Thiago Vasconcelos Teixeira
    Full-Stack Developer
    Imperatriz, MA - Brazil
    GitHub: https://github.com/thiagovt-dev
    Portfolio: https://thiagovasconcelos.dev.br
  `)
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token de acesso (sem "Bearer"). Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      name: 'Authorization',
      in: 'header',
    },
  ).build()
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, doc)
}
