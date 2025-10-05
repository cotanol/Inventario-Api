import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AssignRolesDto, CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsuarioPerfil } from './entities/usuario-perfil.entity';
import { Perfil } from './entities/perfil.entity';
import { OpcionMenu } from './entities/opcion-menu.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(UsuarioPerfil)
    private usuarioPerfilRepository: Repository<UsuarioPerfil>,
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
    @InjectRepository(OpcionMenu)
    private opcionMenuRepository: Repository<OpcionMenu>,
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
        id: In(perfilesIds),
      });
      if (perfiles.length !== perfilesIds.length) {
        throw new BadRequestException(
          'Uno o más IDs de perfil no son válidos.',
        );
      }

      // 4. Creamos los registros en la tabla pivote 'usuarios_perfiles'.
      const userProfiles = perfiles.map((perfil) =>
        this.usuarioPerfilRepository.create({
          idUsuario: user.id,
          idPerfil: perfil.id,
        }),
      );
      // Guardamos las relaciones de perfil dentro de la transacción
      await queryRunner.manager.save(userProfiles);

      // 5. Si todo salió bien, confirmamos la transacción.
      await queryRunner.commitTransaction();

      const token = this.getJwtToken({ id: user.id });
      const newUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['perfilesLink', 'perfilesLink.perfil'],
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
        id: true,
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
      relations: ['perfilesLink', 'perfilesLink.perfil'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.getJwtToken({ id: user.id });

    return {
      user: this._buildUserResponse(user),
      token: token,
    };
  }

  async checkAuthStatus(user: Usuario) {
    const token = this.getJwtToken({ id: user.id });

    return {
      user: this._buildUserResponse(user),
      token: token,
    };
  }

  async findAllPerfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find({
      order: {
        nombre: 'ASC', // Opcional: ordenar alfabéticamente
      },
    });
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['perfilesLink', 'perfilesLink.perfil'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return this._buildUserResponse(user);
  }

  async findAllUsers() {
    const users = await this.userRepository.find({
      relations: ['perfilesLink', 'perfilesLink.perfil'],
      order: {
        nombres: 'ASC',
      },
    });
    return users.map((user) => this._buildUserResponse(user));
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    await this.usuarioPerfilRepository.delete({ idUsuario: id });

    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    return { message: 'Usuario eliminado correctamente.' };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { perfilesIds, ...userDataToUpdate } = updateUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(Usuario, { id });
      if (!user) {
        throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
      }

      if (Object.keys(userDataToUpdate).length > 0) {
        queryRunner.manager.merge(Usuario, user, userDataToUpdate);
        await queryRunner.manager.save(user);
      }

      if (perfilesIds) {
        const perfiles = await this.perfilRepository.findBy({
          id: In(perfilesIds),
        });
        if (perfiles.length !== perfilesIds.length) {
          throw new BadRequestException(
            'Uno o más IDs de perfil no son válidos.',
          );
        }

        await queryRunner.manager.delete(UsuarioPerfil, { idUsuario: id });

        const newUserProfiles = perfiles.map((perfil) =>
          this.usuarioPerfilRepository.create({
            idUsuario: id,
            idPerfil: perfil.id,
          }),
        );
        await queryRunner.manager.save(newUserProfiles);
      }

      await queryRunner.commitTransaction();

      const updatedUserWithRelations = await this.userRepository.findOne({
        where: { id },
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

  async assignRoles(
    userId: number,
    assignRolesDto: AssignRolesDto,
  ): Promise<{ message: string }> {
    const { perfilesIds } = assignRolesDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    const perfiles = await this.perfilRepository.findBy({
      id: In(perfilesIds),
    });

    if (perfiles.length !== perfilesIds.length) {
      throw new BadRequestException('Uno o más IDs de perfil no son válidos.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(UsuarioPerfil, { idUsuario: userId });
      const newUserProfiles = perfiles.map((perfil) =>
        this.usuarioPerfilRepository.create({
          idUsuario: userId,
          idPerfil: perfil.id,
        }),
      );
      await queryRunner.manager.save(newUserProfiles);

      // 3c. Confirma la transacción
      await queryRunner.commitTransaction();
      return {
        message: `Roles para el usuario ${user.nombres} actualizados correctamente.`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  // --- FUNCIÓN OPTIMIZADA Y CON ORDENAMIENTO ---
  async getMenuForUser(user: Usuario): Promise<any[]> {
    const rawMenuItems = await this.opcionMenuRepository
      .createQueryBuilder('opcionMenu')
      // --- CORRECCIÓN: Selección explícita de columnas con alias en camelCase ---
      .select([
        'opcionMenu.id AS id',
        'opcionMenu.nombre AS nombre',
        'opcionMenu.urlMenu AS "urlMenu"', // Las mayúsculas en el alias requieren comillas
        'opcionMenu.descripcion AS descripcion',
        'opcionMenu.estadoRegistro AS "estadoRegistro"',
        'opcionMenu.idPadre AS "idPadre"',
        'omp.orden AS orden',
      ])
      .innerJoin('opcionMenu.perfilesLink', 'omp')
      .innerJoin('omp.perfil', 'perfil')
      .innerJoin('perfil.usuariosLink', 'up')
      .where('up.idUsuario = :userId', { userId: user.id })
      .getRawMany();

    if (rawMenuItems.length === 0) {
      return [];
    }

    // El resto de la lógica funcionará perfectamente con los objetos limpios que ahora recibe.
    const menuOptionsMap = new Map<string, any>();
    for (const item of rawMenuItems) {
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
    options: OpcionMenu[],
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

    return {
      id: user.id,
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
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
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
