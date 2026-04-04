import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { GetUser } from './decorators/get-user.decorator';

import { ValidPermissions } from './interfaces/valid-permissions.interface';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Este endpoint permite a un administrador crear un nuevo usuario en el sistema. La contraseña debe cumplir con los requisitos de seguridad.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente. Devuelve el usuario y el token.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: La información proporcionada es inválida.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes el permiso CREAR_USUARIO.',
  })
  @RequirePermissions(ValidPermissions.CREAR_USUARIO)
  @ApiStandardItemResponse('Usuario creado correctamente', 'created', {
    dataExample: swaggerExamples.authSession,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica a un usuario con su correo electrónico y contraseña. Si las credenciales son válidas, devuelve los datos del usuario y un JSON Web Token (JWT).',
  })
  @ApiResponse({
    status: 201,
    description: 'Autenticación exitosa. Devuelve el usuario y el token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Credenciales inválidas.',
  })
  @ApiStandardItemResponse('Sesion iniciada correctamente', 'ok', {
    dataExample: swaggerExamples.authSession,
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiOperation({
    summary: 'Verificar estado de autenticación',
    description:
      'Permite validar el token JWT actual. Si el token es válido, devuelve los datos del usuario y un nuevo token refrescado.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token válido. Devuelve el usuario y un nuevo token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: El token no es válido o ha expirado.',
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

  //  MENÚ DINÁMICO ---
  @Get('menu')
  @ApiOperation({
    summary: 'Obtener el menú dinámico del usuario',
    description:
      'Devuelve la estructura jerárquica del menú de navegación basada en los perfiles asignados al usuario autenticado.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Menú generado exitosamente.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: El token no es válido o ha expirado.',
  })
  @RequirePermissions() // Solo requiere autenticación
  @ApiStandardItemResponse('Menu generado correctamente', 'ok', {
    dataExample: swaggerExamples.menu,
    isArray: true,
  })
  getMenu(@GetUser() user: AuthenticatedUser) {
    return this.authService.getMenuForUser(user);
  }

  // Listar todos los perfiles/roles ---
  @Get('perfiles')
  @ApiOperation({
    summary: 'Listar todos los perfiles/roles disponibles',
    description:
      'Devuelve una lista de todos los perfiles que se pueden asignar a los usuarios. Requiere rol de administrador.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de perfiles obtenida.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes el permiso VER_PERFILES.',
  })
  @RequirePermissions(ValidPermissions.VER_PERFILES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de perfiles', swaggerExamples.perfil)
  findAllPerfiles(@Query() paginationQuery: PaginationQueryDto) {
    return this.authService.findAllPerfiles(paginationQuery);
  }

  //  Listar todos los usuarios ---
  @Get('usuarios')
  @ApiOperation({
    summary: 'Listar todos los usuarios del sistema',
    description:
      'Devuelve una lista de todos los usuarios registrados, incluyendo sus perfiles. Requiere rol de administrador.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes el permiso VER_USUARIOS.',
  })
  @RequirePermissions(ValidPermissions.VER_USUARIOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de usuarios',
    swaggerExamples.authUser,
  )
  findAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return this.authService.findAllUsers(paginationQuery);
  }

  @Patch('change-status/:id')
  @ApiOperation({
    summary: 'Cambiar el estado de registro de un usuario',
    description:
      'Permite activar o desactivar la cuenta de un usuario existente. Requiere rol de administrador.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Estado del usuario actualizado.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: El estado proporcionado es inválido.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes permisos de administrador.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Usuario no encontrado.',
  })
  @RequirePermissions(ValidPermissions.EDITAR_USUARIO)
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
  @ApiOperation({
    summary: 'Obtener información de un usuario por ID',
    description:
      'Permite obtener los datos de un usuario específico utilizando su ID. Requiere rol de administrador.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado y datos devueltos correctamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes permisos de administrador.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Usuario no encontrado.',
  })
  @RequirePermissions(ValidPermissions.VER_USUARIOS)
  @ApiStandardItemResponse('Usuario obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.authUser,
  })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findUserById(id);
  }

  @Patch('update-user/:id')
  @ApiOperation({
    summary: 'Actualizar la información de un usuario',
    description:
      'Permite modificar los datos de un usuario existente, incluyendo sus perfiles. Requiere rol de administrador.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: La información proporcionada es inválida.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: No tienes permisos de administrador.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Usuario no encontrado.',
  })
  @RequirePermissions(ValidPermissions.EDITAR_USUARIO)
  @ApiStandardItemResponse('Usuario actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.authUser,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Get('permisos')
  @RequirePermissions(ValidPermissions.VER_PERFILES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de permisos',
    swaggerExamples.permiso,
  )
  findAllPermisos(@Query() paginationQuery: PaginationQueryDto) {
    return this.authService.findAllPermisos(paginationQuery);
  }

  @Post('perfiles')
  @RequirePermissions(ValidPermissions.CREAR_PERFIL)
  @ApiStandardItemResponse('Perfil creado correctamente', 'created', {
    dataExample: swaggerExamples.perfil,
  })
  createPerfil(@Body() createPerfilDto: CreatePerfilDto) {
    return this.authService.createPerfil(createPerfilDto);
  }

  @Get('perfiles/:id')
  @RequirePermissions(ValidPermissions.VER_PERFILES)
  @ApiStandardItemResponse('Perfil obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.perfil,
  })
  findOnePerfil(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOnePerfil(id);
  }

  @Patch('perfiles/:id')
  @RequirePermissions(ValidPermissions.EDITAR_PERFIL)
  @ApiStandardItemResponse('Perfil actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.perfil,
  })
  updatePerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerfilDto: UpdatePerfilDto,
  ) {
    return this.authService.updatePerfil(id, updatePerfilDto);
  }

  @Patch('perfiles/:id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_PERFIL)
  @ApiStandardItemResponse('Estado de perfil actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.statusMessage,
  })
  changeStatusPerfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.authService.changeStatusPerfil(id, changeStatusDto);
  }
}
