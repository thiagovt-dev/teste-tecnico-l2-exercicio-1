import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  it('validates and returns token', async () => {
    process.env.DEMO_USER = 'u'
    process.env.DEMO_PASS = 'p'
    const service = new AuthService(new JwtService({ secret: 's' }))
    const user = await service.validate('u','p')
    const token = await service.token(user)
    expect(token.access_token).toBeDefined()
  })
})
