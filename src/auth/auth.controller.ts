import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from 'src/user/dtos';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common';
import { UserService } from 'src/user/services';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile', description: 'Retrieves the profile of the currently authenticated user.' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.userService.findOneById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile', description: 'Updated the profile of the currently authenticated user.' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

  @Post('/signUp')
  @ApiOperation({ summary: 'User sign up', description: 'Registers a new user and returns tokens.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, user under this username already exists.' })
  async signUp(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signUp(userDto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return tokens;
  }

  @Post('/signIn')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User sign in', description: 'Authenticates a user and returns tokens.' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  async signIn(@Body() userDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signIn(userDto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return tokens;
  }

  @Post('tokens/update')
  @ApiOperation({ summary: 'Update access token', description: 'Refreshes the access token using the refresh token.' })
  @ApiResponse({ status: 200, description: 'Access token updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized, invalid refresh token.' })
  async updateTokens(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    const accessToken = await this.authService.updateAccessToken(refreshToken);

    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return accessToken;
  }
}