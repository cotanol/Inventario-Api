import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { GetUser } from './decorators/get-user.decorator';
import { Usuario } from './entities/usuario.entity';

import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(ValidRoles.admin)
  async register(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: Usuario,
  ) {
    return this.authService.create(createUserDto, user);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: Usuario) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('test-auth-private')
  @Auth(ValidRoles.tecnico)
  test(@GetUser() user: Usuario) {
    return {
      message: 'Test private endpoint',
      user,
    };
  }
}
