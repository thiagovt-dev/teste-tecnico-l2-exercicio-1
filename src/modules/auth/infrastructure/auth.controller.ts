import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  
  @Post('login')
  @ApiOperation({
    summary: 'Realiza a autenticação de um usuário',
    description:
      'Autentica o usuário com base nas credenciais e retorna um token JWT em caso de sucesso.',
  })
  @ApiResponse({
    status: 201,
    description: 'Autenticação bem-sucedida, token de acesso retornado.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() dto: LoginDto) {
    const user = await this.service.validate(dto.username, dto.password);
    return this.service.token(user);
  }
}