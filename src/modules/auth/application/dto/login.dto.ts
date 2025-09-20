import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'admin',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Senha para login (mínimo de 3 caracteres)',
    example: 'admin123',
  })
  @IsString()
  @MinLength(3)
  password!: string;
}