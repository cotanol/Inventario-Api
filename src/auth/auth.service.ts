import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';

import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

import { CreateRolDto } from './dto/create-rol.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';

const userAuthInclude = {
  rol: true,
} satisfies Prisma.UsuarioInclude;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { clave, rolId, ...userData } = createUserDto;

    await this.ensureRolExists(rolId);

    const hashedPassword = await bcrypt.hash(clave, 10);
    const emailLower = userData.correoElectronico.toLowerCase().trim();

    const createdUser = await this.prisma.usuario.create({
      data: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correoElectronico: emailLower,
        clave: hashedPassword,
        rolId,
      },
      include: userAuthInclude,
    });

    const token = this.getJwtToken({ usuarioId: createdUser.usuarioId });

    return {
      user: this.buildUserResponse(createdUser),
      token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { clave, correoElectronico } = loginUserDto;
    const emailLower = correoElectronico.toLowerCase().trim();

    const user = await this.prisma.usuario.findUnique({
      where: { correoElectronico: emailLower },
      include: userAuthInclude,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.estadoRegistro) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.getJwtToken({ usuarioId: user.usuarioId });

    return {
      user: this.buildUserResponse(user),
      token,
    };
  }

  async checkAuthStatus(user: AuthenticatedUser) {
    const userWithRol = await this.prisma.usuario.findUnique({
      where: { usuarioId: user.usuarioId },
      include: userAuthInclude,
    });

    if (!userWithRol) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.getJwtToken({ usuarioId: userWithRol.usuarioId });

    return {
      user: this.buildUserResponse(userWithRol),
      token,
    };
  }

  async findAllRoles(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.rol.findMany({
        orderBy: { nombre: 'asc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.rol.count(),
    ]);

    return {
      items,
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: items.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async findUserById(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { usuarioId: id },
      include: userAuthInclude,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    return this.buildUserResponse(user);
  }

  async findAllUsers(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [users, totalItems] = await Promise.all([
      this.prisma.usuario.findMany({
        include: userAuthInclude,
        orderBy: { nombre: 'asc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.usuario.count(),
    ]);

    return {
      items: users.map((dbUser) => this.buildUserResponse(dbUser)),
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: users.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const currentUser = await this.prisma.usuario.findUnique({
      where: { usuarioId: id },
      include: userAuthInclude,
    });

    if (!currentUser) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (updateUserDto.rolId !== undefined) {
      await this.ensureRolExists(updateUserDto.rolId);
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { usuarioId: id },
      data: {
        nombre: updateUserDto.nombre,
        apellido: updateUserDto.apellido,
        correoElectronico: updateUserDto.correoElectronico
          ? updateUserDto.correoElectronico.toLowerCase().trim()
          : undefined,
        rolId: updateUserDto.rolId,
      },
      include: userAuthInclude,
    });

    return this.buildUserResponse(updatedUser);
  }

  async changeStatus(userId: number, changeStatusDto: ChangeStatusDto) {
    const { estadoRegistro } = changeStatusDto;

    await this.prisma.usuario.update({
      where: { usuarioId: userId },
      data: { estadoRegistro },
    });

    return { message: `Estado del usuario actualizado a ${estadoRegistro}.` };
  }

  async createRole(createRolDto: CreateRolDto) {
    return this.prisma.rol.create({
      data: {
        nombre: createRolDto.nombre,
        descripcion: createRolDto.descripcion,
        permisos: createRolDto.permisos,
      },
    });
  }

  async findOneRole(id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { rolId: id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado.`);
    }

    return rol;
  }

  async updateRole(id: number, updateRolDto: UpdateRolDto) {
    await this.findOneRole(id);

    return this.prisma.rol.update({
      where: { rolId: id },
      data: {
        nombre: updateRolDto.nombre,
        descripcion: updateRolDto.descripcion,
        permisos: updateRolDto.permisos,
      },
    });
  }

  async changeStatusRole(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneRole(id);

    await this.prisma.rol.update({
      where: { rolId: id },
      data: { estadoRegistro: changeStatusDto.estadoRegistro },
    });

    return { message: 'Estado del rol actualizado correctamente.' };
  }

  private buildUserResponse(
    user: Prisma.UsuarioGetPayload<{ include: typeof userAuthInclude }>,
  ) {
    return {
      usuarioId: user.usuarioId,
      nombre: user.nombre,
      apellido: user.apellido,
      correoElectronico: user.correoElectronico,
      estadoRegistro: user.estadoRegistro,
      fechaCreacion: user.fechaCreacion,
      fechaModificacion: user.fechaActualizacion,
      rol: user.rol.nombre,
      permisos: user.rol.permisos,
    };
  }

  private async ensureRolExists(rolId: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { rolId },
      select: { rolId: true },
    });

    if (!rol) {
      throw new NotFoundException('El rol especificado no existe.');
    }
  }

  private getJwtToken(payload: JwtPayLoad) {
    return this.jwtService.sign(payload);
  }
}
