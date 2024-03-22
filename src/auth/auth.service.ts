import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services';
import { User } from 'src/user/entities';
import { CreateUserDto } from 'src/user/dtos';
import { LoginUserDto } from 'src/user/dtos/login-user.dto';
import { comparePassword, hashPassword } from 'src/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(userDto: Readonly<CreateUserDto>) {
    const candidate = await this.userService.findOneByUsername(
      userDto.username,
    );

    if (candidate) {
      throw new BadRequestException("Username exists");
    };

    const hashedPassword = await hashPassword(userDto.password);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id);

    return tokens;
  }

  async signIn(userDto: Readonly<LoginUserDto>) {
    const user = await this.userService.findOneByUsername(userDto.username);

    const tokens = await this.generateTokens(user.id);

    return tokens;
  }

  async validateUser(userDto: Readonly<LoginUserDto>): Promise<User> {
    const user = await this.userService.findOneByUsername(userDto.username);

    if (!user || !(await comparePassword(userDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return payload;
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return payload;
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const tokens = await this.generateTokens(userId);

      return tokens.accessToken;
    } catch (e) {
      return null;
    }
  }

  private async generateTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
    const tokens = { accessToken, refreshToken };

    return tokens;
  }
}
