import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

import { perfilTecnicoId } from 'src/seed/data/seed-data';
import { UsuarioPerfil } from './entities/usuario-perfil.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(UsuarioPerfil)
    private usuarioPerfilRepository: Repository<UsuarioPerfil>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, userPrinc: Usuario) {
    try {
      const { clave, ...userData } = createUserDto;
      const hashedPassword = await bcrypt.hash(clave, 10);
      const emailLower = createUserDto.correoElectronico
        .toLocaleLowerCase()
        .trim();
      const user = this.userRepository.create({
        ...userData,
        clave: hashedPassword,
        usuarioCreacion: userPrinc,
        correoElectronico: emailLower,
      });
      await this.userRepository.save(user);

      const userResponse: Partial<Usuario> = user;
      delete userResponse.clave;

      const usuarioPerfil = this.usuarioPerfilRepository.create({
        idPerfil: perfilTecnicoId,
        idUsuario: user.id,
      });
      await this.usuarioPerfilRepository.save(usuarioPerfil);

      return {
        ...userResponse,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  // TODO: JWT y no devolver la contraseña
  async login(loginUserDto: LoginUserDto) {
    const { clave, correoElectronico } = loginUserDto;
    const emailLower = correoElectronico.toLowerCase().trim();
    const user = await this.userRepository.findOne({
      where: { correoElectronico: emailLower },
      select: {
        correoElectronico: true,
        clave: true,
        id: true,
        estadoRegistro: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: Usuario) {
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    } else {
      throw new InternalServerErrorException('Database error');
    }
  }
}
