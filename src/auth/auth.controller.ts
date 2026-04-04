import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermisoModulo } from 'generated/prisma/client';

import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { CreateRolDto } from './dto/create-rol.dto';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @RequirePermissions(PermisoModulo.USUARIOS)
  @ApiStandardItemResponse('Usuario creado correctamente', 'created', {
    dataExample: swaggerExamples.authSession,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve token JWT.',
  })
  @ApiResponse({ status: 201, description: 'Autenticación exitosa.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ApiStandardItemResponse('Sesion iniciada correctamente', 'ok', {
    dataExample: swaggerExamples.authSession,
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiOperation({
    summary: 'Verificar estado de autenticación',
    description: 'Valida el token JWT actual.',
  })
  @RequirePermissions()
  @ApiStandardItemResponse(
    'Estado de autenticacion validado correctamente',
    'ok',
    {
      dataExample: swaggerExamples.authSession,
    },
  )
  checkAuthStatus(@GetUser() user: AuthenticatedUser) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('roles')
  @RequirePermissions(PermisoModulo.ROLES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de roles', swaggerExamples.role)
  findAllRoles(@Query() paginationQuery: PaginationQueryDto) {
    return this.authService.findAllRoles(paginationQuery);
  }

  @Get('usuarios')
  @RequirePermissions(PermisoModulo.USUARIOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de usuarios',
    swaggerExamples.authUser,
  )
  findAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return this.authService.findAllUsers(paginationQuery);
  }

  @Patch('change-status/:id')
  @RequirePermissions(PermisoModulo.USUARIOS)
  @ApiStandardItemResponse(
    'Estado de usuario actualizado correctamente',
    'ok',
    {
      dataExample: swaggerExamples.statusMessage,
    },
  )
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.authService.changeStatus(id, changeStatusDto);
  }

  @Get('user/:id')
  @RequirePermissions(PermisoModulo.USUARIOS)
  @ApiStandardItemResponse('Usuario obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.authUser,
  })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findUserById(id);
  }

  @Patch('update-user/:id')
  @RequirePermissions(PermisoModulo.USUARIOS)
  @ApiStandardItemResponse('Usuario actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.authUser,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Post('roles')
  @RequirePermissions(PermisoModulo.ROLES)
  @ApiStandardItemResponse('Rol creado correctamente', 'created', {
    dataExample: swaggerExamples.role,
  })
  createRole(@Body() createRolDto: CreateRolDto) {
    return this.authService.createRole(createRolDto);
  }

  @Get('roles/:id')
  @RequirePermissions(PermisoModulo.ROLES)
  @ApiStandardItemResponse('Rol obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.role,
  })
  findOneRole(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOneRole(id);
  }

  @Patch('roles/:id')
  @RequirePermissions(PermisoModulo.ROLES)
  @ApiStandardItemResponse('Rol actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.role,
  })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    return this.authService.updateRole(id, updateRolDto);
  }

  @Patch('roles/:id/change-status')
  @RequirePermissions(PermisoModulo.ROLES)
  @ApiStandardItemResponse('Estado de rol actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.statusMessage,
  })
  changeStatusRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.authService.changeStatusRole(id, changeStatusDto);
  }
}
