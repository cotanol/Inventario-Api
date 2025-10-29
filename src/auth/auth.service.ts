import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsuarioPerfil } from './entities/usuario-perfil.entity';
import { Perfil } from './entities/perfil.entity';
import { Permiso } from './entities/permiso.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermisoPerfil } from './entities/permiso-perfil.entity';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CreatePerfilDto } from './dto/create-perfil.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(UsuarioPerfil)
    private usuarioPerfilRepository: Repository<UsuarioPerfil>,
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(PermisoPerfil)
    private permisoPerfilRepository: Repository<PermisoPerfil>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 1. Destructuramos correctamente, separando los IDs de los perfiles.
    const { clave, perfilesIds, ...userData } = createUserDto;

    // 2. Iniciamos una transacción para asegurar la integridad de los datos.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(clave, 10);
      const emailLower = userData.correoElectronico.toLocaleLowerCase().trim();

      const user = this.userRepository.create({
        ...userData,
        clave: hashedPassword,
        correoElectronico: emailLower,
      });
      // Guardamos el usuario dentro de la transacción
      await queryRunner.manager.save(user);

      // 3. Verificamos que los perfiles enviados existan.
      const perfiles = await this.perfilRepository.findBy({
        perfilId: In(perfilesIds),
      });
      if (perfiles.length !== perfilesIds.length) {
        throw new BadRequestException(
          'Uno o más IDs de perfil no son válidos.',
        );
      }

      // 4. Creamos los registros en la tabla pivote 'usuarios_perfiles'.
      const userProfiles = perfiles.map((perfil) =>
        this.usuarioPerfilRepository.create({
          usuarioId: user.usuarioId,
          perfilId: perfil.perfilId,
        }),
      );
      // Guardamos las relaciones de perfil dentro de la transacción
      await queryRunner.manager.save(userProfiles);

      // 5. Si todo salió bien, confirmamos la transacción.
      await queryRunner.commitTransaction();

      const token = this.getJwtToken({ usuarioId: user.usuarioId });
      const newUser = await this.userRepository.findOne({
        where: { usuarioId: user.usuarioId },
        relations: [
          'perfilesLink',
          'perfilesLink.perfil',
          'perfilesLink.perfil.permisosLink',
          'perfilesLink.perfil.permisosLink.permiso',
        ],
      });

      if (!newUser) {
        throw new InternalServerErrorException(
          'Error al crear el usuario: no se pudo encontrar el usuario recién guardado.',
        );
      }

      return {
        user: this._buildUserResponse(newUser),
        token: token,
      };
    } catch (error) {
      // 6. Si algo falla, revertimos todos los cambios.
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      // 7. Liberamos el query runner.
      await queryRunner.release();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { clave, correoElectronico } = loginUserDto;
    const emailLower = correoElectronico.toLowerCase().trim();
    const user = await this.userRepository.findOne({
      where: { correoElectronico: emailLower },
      select: {
        usuarioId: true,
        dni: true,
        nombres: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        celular: true,
        correoElectronico: true,
        estadoRegistro: true,
        fechaCreacion: true,
        fechaModificacion: true,
        clave: true, // Necesario para la validación
      },
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.getJwtToken({ usuarioId: user.usuarioId });

    return {
      user: this._buildUserResponse(user),
      token: token,
    };
  }

  async checkAuthStatus(user: Usuario) {
    // Cargar el usuario con todas las relaciones necesarias para los permisos
    const userWithRelations = await this.userRepository.findOne({
      where: { usuarioId: user.usuarioId },
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
    });

    if (!userWithRelations) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.getJwtToken({ usuarioId: user.usuarioId });

    return {
      user: this._buildUserResponse(userWithRelations),
      token: token,
    };
  }

  async findAllPerfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find({
      relations: {
        // Le decimos que dentro de 'permisosLink', también cargue 'permiso'
        permisosLink: {
          permiso: true,
        },
      },
      order: { nombre: 'ASC' },
    });
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { usuarioId: id },
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return this._buildUserResponse(user);
  }

  async findAllUsers() {
    const users = await this.userRepository.find({
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
      order: {
        nombres: 'ASC',
      },
    });
    return users.map((user) => this._buildUserResponse(user));
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { perfilesIds, ...userDataToUpdate } = updateUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(Usuario, {
        usuarioId: id,
      });
      if (!user) {
        throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
      }

      if (Object.keys(userDataToUpdate).length > 0) {
        queryRunner.manager.merge(Usuario, user, userDataToUpdate);
        await queryRunner.manager.save(user);
      }

      if (perfilesIds) {
        const perfiles = await this.perfilRepository.findBy({
          perfilId: In(perfilesIds),
        });
        if (perfiles.length !== perfilesIds.length) {
          throw new BadRequestException(
            'Uno o más IDs de perfil no son válidos.',
          );
        }

        await queryRunner.manager.delete(UsuarioPerfil, { usuarioId: id });

        const newUserProfiles = perfiles.map((perfil) =>
          this.usuarioPerfilRepository.create({
            usuarioId: id,
            perfilId: perfil.perfilId,
          }),
        );
        await queryRunner.manager.save(newUserProfiles);
      }

      await queryRunner.commitTransaction();

      const updatedUserWithRelations = await this.userRepository.findOne({
        where: { usuarioId: id },
        relations: ['perfilesLink', 'perfilesLink.perfil'],
      });

      if (!updatedUserWithRelations) {
        throw new InternalServerErrorException(
          'No se pudo encontrar el usuario después de la actualización.',
        );
      }

      return this._buildUserResponse(updatedUserWithRelations);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus(userId: number, changeStatusDto: ChangeStatusDto) {
    const { estadoRegistro } = changeStatusDto;
    const result = await this.userRepository.update(userId, {
      estadoRegistro,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }
    return { message: `Estado del usuario actualizado a ${estadoRegistro}.` };
  }

  // --- FUNCIÓN OPTIMIZADA Y CON ORDENAMIENTO ---
  async getMenuForUser(user: Usuario): Promise<any[]> {
    // Método alternativo: Usar find con relaciones en lugar de QueryBuilder
    const userWithMenus = await this.userRepository.findOne({
      where: { usuarioId: user.usuarioId },
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
    });

    if (!userWithMenus || !userWithMenus.perfilesLink?.length) {
      return [];
    }

    // Extraer permisos de todos los perfiles del usuario
    const menuOptions: any[] = [];
    userWithMenus.perfilesLink.forEach((userProfile) => {
      if (userProfile.perfil && userProfile.perfil.permisosLink) {
        userProfile.perfil.permisosLink.forEach((menuProfile) => {
          if (menuProfile.permiso && menuProfile.permiso.estadoRegistro) {
            menuOptions.push({
              id: menuProfile.permiso.permisoId,
              nombre: menuProfile.permiso.nombre,
              urlMenu: menuProfile.permiso.urlMenu,
              descripcion: menuProfile.permiso.descripcion,
              estadoRegistro: menuProfile.permiso.estadoRegistro,
              idPadre: menuProfile.permiso.permisoPadreId,
              orden: menuProfile.orden,
            });
          }
        });
      }
    });

    if (menuOptions.length === 0) {
      return [];
    }

    // Eliminar duplicados y ordenar
    const menuOptionsMap = new Map<string, any>();
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

  private buildMenuHierarchy(
    options: any[], // Cambiado de Permiso[] a any[]
    parentId: number | null = null,
    visited = new Set<number>(),
  ): any[] {
    const hierarchy: any[] = [];

    // La lógica de ordenamiento ya se aplicó, así que aquí solo filtramos.
    const children = options.filter((opt) => opt.idPadre === parentId);

    for (const child of children) {
      if (visited.has(child.id)) {
        console.error(
          `Error: Se detectó una dependencia circular en el menú con el ID: ${child.id}`,
        );
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

  private _buildUserResponse(user: Usuario) {
    const perfiles =
      user.perfilesLink?.map((link) => link.perfil?.nombre) || [];

    // Extraer todos los permisos únicos del usuario
    const permisosSet = new Set<string>();
    user.perfilesLink?.forEach((userProfile) => {
      if (userProfile.perfil && userProfile.perfil.permisosLink) {
        userProfile.perfil.permisosLink.forEach((permisoLink) => {
          if (
            permisoLink.permiso &&
            permisoLink.permiso.estadoRegistro &&
            permisoLink.permiso.keyPermiso
          ) {
            permisosSet.add(permisoLink.permiso.keyPermiso);
          }
        });
      }
    });

    return {
      usuarioId: user.usuarioId,
      dni: user.dni,
      nombres: user.nombres,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      celular: user.celular,
      correoElectronico: user.correoElectronico,
      estadoRegistro: user.estadoRegistro,
      fechaCreacion: user.fechaCreacion,
      fechaModificacion: user.fechaModificacion,
      perfiles: perfiles,
      permisos: Array.from(permisosSet), // Array de keyPermisos únicos
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAllPermisos(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: { estadoRegistro: true }, // Opcional: solo traer los permisos activos
      order: { nombre: 'ASC' },
    });
  }

  /* Perfiles */
  async createPerfil(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    const { nombre, descripcion, permisos } = createPerfilDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const perfil = this.perfilRepository.create({ nombre, descripcion });
      await queryRunner.manager.save(perfil);

      if (permisos && permisos.length > 0) {
        const permisosIds = permisos.map((opt) => opt.permisoId);
        const permisosExistentes = await this.permisoRepository.findBy({
          permisoId: In(permisosIds),
        });

        if (permisosExistentes.length !== permisosIds.length) {
          throw new BadRequestException(
            'Uno o más IDs de permisos no son válidos.',
          );
        }

        const enlaces = permisos.map((opt) =>
          this.permisoPerfilRepository.create({
            perfilId: perfil.perfilId,
            permisoId: opt.permisoId,
            orden: opt.orden,
          }),
        );
        await queryRunner.manager.save(enlaces);
      }

      await queryRunner.commitTransaction();
      return this.findOnePerfil(perfil.perfilId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOnePerfil(id: number): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOne({
      where: { perfilId: id },
      relations: ['permisosLink', 'permisosLink.permiso'],
    });
    if (!perfil) {
      throw new NotFoundException(`Perfil con ID "${id}" no encontrado.`);
    }
    return perfil;
  }

  // El método findAllPerfiles() ya lo tienes, así que está perfecto.

  async updatePerfil(
    id: number,
    updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    const { nombre, descripcion, permisos } = updatePerfilDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const perfil = await queryRunner.manager.findOneBy(Perfil, {
        perfilId: id,
      });
      if (!perfil) {
        throw new NotFoundException(`Perfil con ID "${id}" no encontrado.`);
      }

      queryRunner.manager.merge(Perfil, perfil, { nombre, descripcion });
      await queryRunner.manager.save(perfil);

      if (permisos) {
        await queryRunner.manager.delete(PermisoPerfil, { perfilId: id });

        if (permisos.length > 0) {
          const permisosIds = permisos.map((opt) => opt.permisoId);
          const permisosExistentes = await this.permisoRepository.findBy({
            permisoId: In(permisosIds),
          });
          if (permisosExistentes.length !== permisosIds.length) {
            throw new BadRequestException(
              'Uno o más IDs de permisos no son válidos.',
            );
          }

          const nuevosEnlaces = permisos.map((opt) =>
            this.permisoPerfilRepository.create({
              perfilId: id,
              permisoId: opt.permisoId,
              orden: opt.orden,
            }),
          );
          await queryRunner.manager.save(nuevosEnlaces);
        }
      }

      await queryRunner.commitTransaction();
      return this.findOnePerfil(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatusPerfil(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<{ message: string }> {
    const { estadoRegistro } = changeStatusDto;
    const result = await this.perfilRepository.update(id, { estadoRegistro });

    if (result.affected === 0) {
      throw new NotFoundException(`Perfil con ID "${id}" no encontrado.`);
    }
    return { message: `Estado del perfil actualizado correctamente.` };
  }

  private handleDBError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    } else if (error.code === '23503') {
      // Error de llave foránea (foreign key constraint)
      throw new BadRequestException(error.detail);
    } else {
      throw new InternalServerErrorException('Database error');
    }
  }
}
