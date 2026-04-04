import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

import { JwtPayLoad } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: (request: Request): string | null => {
        const authorization = request.headers.authorization;

        if (!authorization) {
          return null;
        }

        const [scheme, token] = authorization.split(' ');

        if (scheme?.toLowerCase() !== 'bearer' || !token) {
          return null;
        }

        return token;
      },
    });
  }

  async validate(payload: JwtPayLoad) {
    const { usuarioId } = payload;

    const user = await this.prisma.usuario.findUnique({
      where: { usuarioId },
      include: { rol: true },
    });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.estadoRegistro) {
      throw new UnauthorizedException('User inactive');
    }

    return {
      usuarioId: user.usuarioId,
      nombres: user.nombre,
      apellido: user.apellido,
      correoElectronico: user.email,
      estadoRegistro: user.estadoRegistro,
      fechaCreacion: user.fechaCreacion,
      fechaModificacion: user.fechaActualizacion,
      rol: user.rol.nombre,
      permisos: user.rol.permisos,
    };
  }
}
