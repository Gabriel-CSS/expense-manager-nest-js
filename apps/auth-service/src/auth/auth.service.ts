import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface TokenPayload {
  email: string;
  sub: string;
  role?: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const { password: _, ...result } = user;
    return this.login(result);
  }

  async validateUser(email: string, password: string): Promise<UserPayload> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: UserPayload) {
    const accessTokenPayload: TokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      type: 'access',
    };

    const refreshTokenPayload: TokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRATION',
          '15m',
        ),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<TokenPayload>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.userService.findById(payload.sub);
      const { password: _, ...result } = user;

      return this.login(result);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
