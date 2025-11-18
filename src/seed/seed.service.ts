import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PermisoPerfil } from 'src/auth/entities/permiso-perfil.entity';
import { Permiso } from 'src/auth/entities/permiso.entity';
import { Perfil } from 'src/auth/entities/perfil.entity';
import { UsuarioPerfil } from 'src/auth/entities/usuario-perfil.entity';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { DataSource, Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(PermisoPerfil)
    private readonly permisoPerfilRepository: Repository<PermisoPerfil>,
    @InjectRepository(UsuarioPerfil)
    private readonly usuarioPerfilRepository: Repository<UsuarioPerfil>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    await this.insertProfiles();
    await this.insertPermisos();
    await this.assignPermisosToProfiles();
    await this.assignProfilesToUsers();
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.dataSource.query(
      'TRUNCATE TABLE "movimientos_inventario", "detalles_pedido", "pedidos", "usuarios", "perfiles", "permisos", "usuarios_perfiles", "permisos_perfiles", "inventarios", "productos", "marcas", "grupos", "lineas", "clientes", "vendedores" RESTART IDENTITY CASCADE',
    );
  }

  private async insertUsers() {
    const seedUsers = initialData.usuarios;
    const users: Usuario[] = [];
    for (const user of seedUsers) {
      const { clave, ...rest } = user;
      const hashedPassword = await bcrypt.hash(clave, 10);
      users.push(
        this.userRepository.create({ ...rest, clave: hashedPassword }),
      );
    }
    await this.userRepository.save(users);
  }

  private async insertProfiles() {
    const seedProfiles = initialData.perfiles;
    const profiles: Perfil[] = [];
    for (const profile of seedProfiles) {
      profiles.push(this.perfilRepository.create(profile));
    }
    await this.perfilRepository.save(profiles);
  }

  private async insertPermisos() {
    const seedPermisos = initialData.permisos;
    const permisos: Permiso[] = [];
    for (const permiso of seedPermisos) {
      permisos.push(this.permisoRepository.create(permiso));
    }
    await this.permisoRepository.save(permisos);
  }

  private async assignPermisosToProfiles() {
    const seedPermisosPerfiles = initialData.permisosPerfiles;
    const permisosPerfiles: PermisoPerfil[] = [];
    for (const pp of seedPermisosPerfiles) {
      permisosPerfiles.push(this.permisoPerfilRepository.create(pp));
    }
    await this.permisoPerfilRepository.save(permisosPerfiles);
  }

  private async assignProfilesToUsers() {
    const seedUsersProfiles = initialData.usuariosPerfiles;
    const usersProfiles: UsuarioPerfil[] = [];
    for (const up of seedUsersProfiles) {
      usersProfiles.push(this.usuarioPerfilRepository.create(up));
    }
    await this.usuarioPerfilRepository.save(usersProfiles);
  }
}
