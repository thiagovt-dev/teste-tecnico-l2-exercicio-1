import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Verifica o status da API',
    description: 'Endpoint para verificar se a aplicação está no ar.',
  })
  getHello(): string {
    return 'Api is working!';
  }
}