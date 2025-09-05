import { PassportStrategy } from '@nestjs/passport';
import { Usuario } from '../entities/usuario.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET!, // TODO: ConfigService para una mejor configuracion
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayLoad): Promise<Usuario> {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: { id },
      // select: {
      //   id: true,
      //   email: true,
      //   nombres: true,
      //   apellidos: true,
      //   isActive: true,
      //   roles: true,
      // },
      relations: ['perfilesLink', 'perfilesLink.perfil'],
    });

    if (!user) throw new UnauthorizedException('Token not valid');

    if (!user.estadoRegistro) throw new UnauthorizedException('User inactive');

    return user;
  }
}
