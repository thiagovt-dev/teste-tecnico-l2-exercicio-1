import { User } from '../../domain/user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}
  async validate(username: string, password: string): Promise<User> {
    const u = process.env.DEMO_USER || 'admin'
    const p = process.env.DEMO_PASS || 'admin'
    if (username !== u || password !== p) throw new UnauthorizedException()
    return new User(username)
  }
  async token(user: User) {
    const sub = user.username
    const access_token = await this.jwt.signAsync({ sub })
    return { access_token }
  }
}
