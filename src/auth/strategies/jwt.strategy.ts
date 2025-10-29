import { PassportStrategy } from '@nestjs/passport';
import { Usuario } from '../entities/usuario.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET!, // TODO: ConfigService para una mejor configuracion
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayLoad): Promise<Usuario> {
    const { usuarioId } = payload;

    const user = await this.userRepository.findOne({
      where: { usuarioId },
      relations: [
        'perfilesLink',
        'perfilesLink.perfil',
        'perfilesLink.perfil.permisosLink',
        'perfilesLink.perfil.permisosLink.permiso',
      ],
    });

    if (!user) throw new UnauthorizedException('Token not valid');

    if (!user.estadoRegistro) throw new UnauthorizedException('User inactive');

    return user;
  }
}
