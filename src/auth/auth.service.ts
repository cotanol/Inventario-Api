import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

import { ChangeStatusDto } from './dto/change-status.dto';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';

const userAuthInclude = {
  perfiles: {
    include: {
      perfil: {
        include: {
          permisos: {
            include: {
              permiso: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.UsuarioInclude;

const perfilWithPermisosInclude = {
  permisos: {
    include: {
      permiso: true,
    },
    orderBy: {
      orden: 'asc',
    },
  },
} satisfies Prisma.PerfilInclude;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { clave, perfilesIds, ...userData } = createUserDto;

    const perfiles = await this.prisma.perfil.findMany({
      where: {
        perfilId: { in: perfilesIds },
      },
      select: { perfilId: true },
    });

    if (perfiles.length !== perfilesIds.length) {
      throw new BadRequestException('Uno o mas IDs de perfil no son validos.');
    }

    const hashedPassword = await bcrypt.hash(clave, 10);
    const emailLower = userData.correoElectronico.toLowerCase().trim();

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.usuario.create({
        data: {
          dni: userData.dni,
          nombre: userData.nombres,
          apellido: this.joinApellidos(
            userData.apellidoPaterno,
            userData.apellidoMaterno,
          ),
          email: emailLower,
          password: hashedPassword,
        },
      });

      await tx.usuarioPerfil.createMany({
        data: perfilesIds.map((perfilId) => ({
          usuarioId: user.usuarioId,
          perfilId,
        })),
      });

      return tx.usuario.findUnique({
        where: { usuarioId: user.usuarioId },
        include: userAuthInclude,
      });
    });

    if (!createdUser) {
      throw new InternalServerErrorException(
        'Error al crear el usuario: no se pudo recuperar el registro.',
      );
    }

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
      where: { email: emailLower },
      include: userAuthInclude,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(clave, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.getJwtToken({ usuarioId: user.usuarioId });

    return {
      user: this.buildUserResponse(user),
      token,
    };
  }

  async checkAuthStatus(user: AuthenticatedUser) {
    const userWithRelations = await this.prisma.usuario.findUnique({
      where: { usuarioId: user.usuarioId },
      include: userAuthInclude,
    });

    if (!userWithRelations) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.getJwtToken({ usuarioId: userWithRelations.usuarioId });

    return {
      user: this.buildUserResponse(userWithRelations),
      token,
    };
  }

  async findAllPerfiles(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [perfiles, totalItems] = await Promise.all([
      this.prisma.perfil.findMany({
        include: perfilWithPermisosInclude,
        orderBy: { nombre: 'asc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.perfil.count(),
    ]);

    return {
      items: perfiles.map((perfil) => this.mapPerfilResponse(perfil)),
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: perfiles.length,
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
      items: users.map((user) => this.buildUserResponse(user)),
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
    const { perfilesIds, ...userDataToUpdate } = updateUserDto;

    const user = await this.prisma.usuario.findUnique({
      where: { usuarioId: id },
      select: {
        usuarioId: true,
        apellido: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (perfilesIds && perfilesIds.length > 0) {
      const perfiles = await this.prisma.perfil.findMany({
        where: {
          perfilId: { in: perfilesIds },
        },
        select: { perfilId: true },
      });

      if (perfiles.length !== perfilesIds.length) {
        throw new BadRequestException(
          'Uno o mas IDs de perfil no son validos.',
        );
      }
    }

    const userData = this.buildPrismaUserUpdateData(
      {
        apellido: user.apellido,
      },
      userDataToUpdate,
    );

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      if (this.hasPrismaUserUpdateData(userData)) {
        await tx.usuario.update({
          where: { usuarioId: id },
          data: userData,
        });
      }

      if (perfilesIds) {
        await tx.usuarioPerfil.deleteMany({ where: { usuarioId: id } });

        await tx.usuarioPerfil.createMany({
          data: perfilesIds.map((perfilId) => ({
            usuarioId: id,
            perfilId,
          })),
        });
      }

      return tx.usuario.findUnique({
        where: { usuarioId: id },
        include: userAuthInclude,
      });
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'No se pudo encontrar el usuario despues de la actualizacion.',
      );
    }

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

  async getMenuForUser(user: AuthenticatedUser) {
    const userWithMenus = await this.prisma.usuario.findUnique({
      where: { usuarioId: user.usuarioId },
      include: userAuthInclude,
    });

    if (!userWithMenus || userWithMenus.perfiles.length === 0) {
      return [];
    }

    const menuOptions: Array<{
      id: number;
      nombre: string;
      urlMenu: string | null;
      descripcion: string | null;
      estadoRegistro: boolean;
      idPadre: number | null;
      orden: number;
    }> = [];

    for (const perfilLink of userWithMenus.perfiles) {
      for (const permisoLink of perfilLink.perfil.permisos) {
        if (
          permisoLink.permiso.estadoRegistro &&
          permisoLink.permiso.tipo === 'MENU'
        ) {
          menuOptions.push({
            id: permisoLink.permiso.permisoId,
            nombre: permisoLink.permiso.nombre,
            urlMenu: permisoLink.permiso.ruta,
            descripcion: permisoLink.permiso.descripcion,
            estadoRegistro: permisoLink.permiso.estadoRegistro,
            idPadre: permisoLink.permiso.permisoPadreId,
            orden: permisoLink.orden,
          });
        }
      }
    }

    if (menuOptions.length === 0) {
      return [];
    }

    const menuOptionsMap = new Map<number, (typeof menuOptions)[number]>();
    for (const item of menuOptions) {
      const existingItem = menuOptionsMap.get(item.id);
      if (!existingItem || item.orden < existingItem.orden) {
        menuOptionsMap.set(item.id, item);
      }
    }

    const allOptions = Array.from(menuOptionsMap.values());
    allOptions.sort((a, b) => a.orden - b.orden);

    return this.buildMenuHierarchy(allOptions);
  }

  async findAllPermisos(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const where: Prisma.PermisoWhereInput = { estadoRegistro: true };

    const [items, totalItems] = await Promise.all([
      this.prisma.permiso.findMany({
        where,
        orderBy: { nombre: 'asc' },
        select: {
          permisoId: true,
          nombre: true,
          descripcion: true,
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.permiso.count({ where }),
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

  async createPerfil(createPerfilDto: CreatePerfilDto) {
    const { nombre, descripcion, permisos } = createPerfilDto;

    if (permisos.length > 0) {
      const permisosIds = permisos.map((opt) => opt.permisoId);
      const permisosExistentes = await this.prisma.permiso.findMany({
        where: {
          permisoId: { in: permisosIds },
        },
        select: { permisoId: true },
      });

      if (permisosExistentes.length !== permisosIds.length) {
        throw new BadRequestException(
          'Uno o mas IDs de permisos no son validos.',
        );
      }
    }

    const perfil = await this.prisma.$transaction(async (tx) => {
      const createdPerfil = await tx.perfil.create({
        data: { nombre, descripcion },
      });

      if (permisos.length > 0) {
        await tx.permisoPerfil.createMany({
          data: permisos.map((opt) => ({
            perfilId: createdPerfil.perfilId,
            permisoId: opt.permisoId,
            orden: opt.orden,
          })),
        });
      }

      return tx.perfil.findUnique({
        where: { perfilId: createdPerfil.perfilId },
        include: perfilWithPermisosInclude,
      });
    });

    if (!perfil) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el perfil recien creado.',
      );
    }

    return this.mapPerfilResponse(perfil);
  }

  async findOnePerfil(id: number) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { perfilId: id },
      include: perfilWithPermisosInclude,
    });

    if (!perfil) {
      throw new NotFoundException(`Perfil con ID "${id}" no encontrado.`);
    }

    return this.mapPerfilResponse(perfil);
  }

  async updatePerfil(id: number, updatePerfilDto: UpdatePerfilDto) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { perfilId: id },
      select: { perfilId: true },
    });

    if (!perfil) {
      throw new NotFoundException(`Perfil con ID "${id}" no encontrado.`);
    }

    if (updatePerfilDto.permisos) {
      const permisosIds = updatePerfilDto.permisos.map((opt) => opt.permisoId);

      if (permisosIds.length > 0) {
        const permisosExistentes = await this.prisma.permiso.findMany({
          where: {
            permisoId: { in: permisosIds },
          },
          select: { permisoId: true },
        });

        if (permisosExistentes.length !== permisosIds.length) {
          throw new BadRequestException(
            'Uno o mas IDs de permisos no son validos.',
          );
        }
      }
    }

    const { permisos, ...perfilData } = updatePerfilDto;

    const updatedPerfil = await this.prisma.$transaction(async (tx) => {
      if (Object.keys(perfilData).length > 0) {
        await tx.perfil.update({
          where: { perfilId: id },
          data: perfilData,
        });
      }

      if (permisos) {
        await tx.permisoPerfil.deleteMany({ where: { perfilId: id } });

        if (permisos.length > 0) {
          await tx.permisoPerfil.createMany({
            data: permisos.map((opt) => ({
              perfilId: id,
              permisoId: opt.permisoId,
              orden: opt.orden,
            })),
          });
        }
      }

      return tx.perfil.findUnique({
        where: { perfilId: id },
        include: perfilWithPermisosInclude,
      });
    });

    if (!updatedPerfil) {
      throw new InternalServerErrorException(
        'No se pudo encontrar el perfil despues de la actualizacion.',
      );
    }

    return this.mapPerfilResponse(updatedPerfil);
  }

  async changeStatusPerfil(id: number, changeStatusDto: ChangeStatusDto) {
    const { estadoRegistro } = changeStatusDto;

    await this.prisma.perfil.update({
      where: { perfilId: id },
      data: { estadoRegistro },
    });

    return { message: 'Estado del perfil actualizado correctamente.' };
  }

  private buildMenuHierarchy(
    options: Array<{
      id: number;
      idPadre: number | null;
      orden: number;
      [key: string]: unknown;
    }>,
    parentId: number | null = null,
    visited = new Set<number>(),
  ): Array<Record<string, unknown>> {
    const hierarchy: Array<Record<string, unknown>> = [];
    const children = options.filter((opt) => opt.idPadre === parentId);

    for (const child of children) {
      if (visited.has(child.id)) {
        continue;
      }

      visited.add(child.id);
      const node = {
        ...child,
        hijos: this.buildMenuHierarchy(options, child.id, visited),
      };
      hierarchy.push(node);
      visited.delete(child.id);
    }

    return hierarchy;
  }

  private buildUserResponse(
    user: Prisma.UsuarioGetPayload<{ include: typeof userAuthInclude }>,
  ) {
    const apellidos = this.splitApellidos(user.apellido);

    const perfiles = user.perfiles
      .map((link) => link.perfil?.nombre)
      .filter((perfil): perfil is string => Boolean(perfil));

    const permisosSet = new Set<string>();
    for (const userProfile of user.perfiles) {
      for (const permisoLink of userProfile.perfil.permisos) {
        if (
          permisoLink.permiso.estadoRegistro &&
          permisoLink.permiso.tipo === 'ACCION'
        ) {
          permisosSet.add(this.toPermissionKey(permisoLink.permiso.nombre));
        }
      }
    }

    return {
      usuarioId: user.usuarioId,
      dni: user.dni,
      nombres: user.nombre,
      apellidoPaterno: apellidos.apellidoPaterno,
      apellidoMaterno: apellidos.apellidoMaterno,
      celular: null,
      correoElectronico: user.email,
      estadoRegistro: user.estadoRegistro,
      fechaCreacion: user.fechaCreacion,
      fechaModificacion: user.fechaActualizacion,
      perfiles,
      permisos: Array.from(permisosSet),
    };
  }

  private mapPerfilResponse(
    perfil: Prisma.PerfilGetPayload<{
      include: typeof perfilWithPermisosInclude;
    }>,
  ) {
    return {
      perfilId: perfil.perfilId,
      nombre: perfil.nombre,
      descripcion: perfil.descripcion,
      estadoRegistro: perfil.estadoRegistro,
      fechaCreacion: perfil.fechaCreacion,
      fechaModificacion: perfil.fechaActualizacion,
      permisosLink: perfil.permisos.map((permisoLink) => ({
        permisoId: permisoLink.permisoId,
        orden: permisoLink.orden,
        permiso: {
          permisoId: permisoLink.permiso.permisoId,
          nombre: permisoLink.permiso.nombre,
          descripcion: permisoLink.permiso.descripcion,
        },
      })),
    };
  }

  private splitApellidos(apellidoCompleto: string) {
    const normalized = apellidoCompleto.trim();
    if (!normalized) {
      return {
        apellidoPaterno: '',
        apellidoMaterno: null as string | null,
      };
    }

    const parts = normalized.split(/\s+/);
    const apellidoPaterno = parts[0] ?? '';
    const apellidoMaterno = parts.slice(1).join(' ') || null;

    return { apellidoPaterno, apellidoMaterno };
  }

  private joinApellidos(
    apellidoPaterno: string,
    apellidoMaterno?: string | null,
  ) {
    const values = [apellidoPaterno?.trim(), apellidoMaterno?.trim()].filter(
      (value): value is string => Boolean(value),
    );

    return values.join(' ');
  }

  private buildPrismaUserUpdateData(
    currentUser: {
      apellido: string;
    },
    userDataToUpdate: Omit<UpdateUserDto, 'perfilesIds'>,
  ): Prisma.UsuarioUpdateInput {
    const currentApellidos = this.splitApellidos(currentUser.apellido);
    const apellidoPaterno =
      userDataToUpdate.apellidoPaterno ?? currentApellidos.apellidoPaterno;
    const apellidoMaterno =
      userDataToUpdate.apellidoMaterno ?? currentApellidos.apellidoMaterno;

    return {
      dni: userDataToUpdate.dni,
      nombre: userDataToUpdate.nombres,
      apellido:
        userDataToUpdate.apellidoPaterno !== undefined ||
        userDataToUpdate.apellidoMaterno !== undefined
          ? this.joinApellidos(apellidoPaterno, apellidoMaterno)
          : undefined,
      email: userDataToUpdate.correoElectronico
        ? userDataToUpdate.correoElectronico.toLowerCase().trim()
        : undefined,
    };
  }

  private hasPrismaUserUpdateData(data: Prisma.UsuarioUpdateInput): boolean {
    return (
      data.dni !== undefined ||
      data.nombre !== undefined ||
      data.apellido !== undefined ||
      data.email !== undefined
    );
  }

  private getJwtToken(payload: JwtPayLoad) {
    return this.jwtService.sign(payload);
  }

  private toPermissionKey(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }
}
