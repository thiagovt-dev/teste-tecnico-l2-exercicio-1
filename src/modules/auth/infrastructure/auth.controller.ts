import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '../application/services/auth.service'
import { LoginDto } from '../application/dto/login.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.service.validate(dto.username, dto.password)
    return this.service.token(user)
  }
}
