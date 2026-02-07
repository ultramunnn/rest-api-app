import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import type { StringValue } from 'ms';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashed,
    });
    return user;
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessExpires = (process.env.JWT_ACCESS_EXPIRES ?? '15m') as StringValue;
    const refreshExpires = (process.env.JWT_REFRESH_EXPIRES ?? '7d') as StringValue;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessExpires,
    });

    const refreshSignOptions: { expiresIn: StringValue; secret?: string } = {
      expiresIn: refreshExpires,
    };
    if (process.env.JWT_REFRESH_SECRET) {
      refreshSignOptions.secret = process.env.JWT_REFRESH_SECRET;
    }

    const refreshToken = this.jwtService.sign(payload, refreshSignOptions);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await user.update({
      refreshToken: hashedRefresh,
    });

    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = process.env.JWT_REFRESH_SECRET
        ? this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
          })
        : this.jwtService.verify(refreshToken);

      const user = await this.usersService.findByIdWithRefreshToken(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const valid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!valid) {
        throw new UnauthorizedException();
      }

      const tokens = await this.generateTokens(user.id, user.email);

      const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

      await user.update({
        refreshToken: hashedRefresh,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
