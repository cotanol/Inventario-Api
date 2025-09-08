import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OpcionMenuPerfil } from 'src/auth/entities/opcion-menu-perfil.entity';
import { OpcionMenu } from 'src/auth/entities/opcion-menu.entity';
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
    @InjectRepository(OpcionMenu)
    private readonly opcionMenuRepository: Repository<OpcionMenu>,
    @InjectRepository(OpcionMenuPerfil)
    private readonly opcionMenuPerfilRepository: Repository<OpcionMenuPerfil>,
    @InjectRepository(UsuarioPerfil)
    private readonly usuarioPerfilRepository: Repository<UsuarioPerfil>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertUsers();
    await this.insertProfiles();
    await this.insertMenuOptions();
    await this.assignMenuOptionsToProfiles();
    await this.assignProfilesToUsers();
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.dataSource.query(
      'TRUNCATE TABLE "usuarios", "perfiles", "opciones_menu", "usuarios_perfiles", "opciones_menu_perfiles" RESTART IDENTITY CASCADE',
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

  private async insertMenuOptions() {
    const seedMenuOptions = initialData.opcionesMenu;
    const menuOptions: OpcionMenu[] = [];
    for (const option of seedMenuOptions) {
      menuOptions.push(this.opcionMenuRepository.create(option));
    }
    await this.opcionMenuRepository.save(menuOptions);
  }

  private async assignMenuOptionsToProfiles() {
    const seedMenuOptionsProfiles = initialData.opcionesMenuPerfiles;
    const menuOptionsProfiles: OpcionMenuPerfil[] = [];
    for (const omp of seedMenuOptionsProfiles) {
      menuOptionsProfiles.push(this.opcionMenuPerfilRepository.create(omp));
    }
    await this.opcionMenuPerfilRepository.save(menuOptionsProfiles);
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
