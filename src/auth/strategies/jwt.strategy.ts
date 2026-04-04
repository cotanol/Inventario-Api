import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

import { JwtPayLoad } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayLoad) {
    const { usuarioId } = payload;

    const user = await this.prisma.usuario.findUnique({
      where: { usuarioId },
      include: {
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.estadoRegistro) {
      throw new UnauthorizedException('User inactive');
    }

    return {
      usuarioId: user.usuarioId,
      dni: user.dni,
      nombres: user.nombre,
      apellidoPaterno: user.apellido,
      apellidoMaterno: null,
      celular: null,
      correoElectronico: user.email,
      estadoRegistro: user.estadoRegistro,
      fechaCreacion: user.fechaCreacion,
      fechaModificacion: user.fechaActualizacion,
      perfilesLink: user.perfiles.map((perfilLink) => ({
        perfilId: perfilLink.perfil.perfilId,
        nombre: perfilLink.perfil.nombre,
        descripcion: perfilLink.perfil.descripcion,
        estadoRegistro: perfilLink.perfil.estadoRegistro,
        permisosLink: perfilLink.perfil.permisos.map((permisoLink) => ({
          permisoId: permisoLink.permiso.permisoId,
          nombre: permisoLink.permiso.nombre,
          descripcion: permisoLink.permiso.descripcion,
          tipoPermiso: permisoLink.permiso.tipo,
          urlMenu: permisoLink.permiso.ruta,
          icono: permisoLink.permiso.icono,
          idPadre: permisoLink.permiso.permisoPadreId,
          estadoRegistro: permisoLink.permiso.estadoRegistro,
          orden: permisoLink.orden,
        })),
      })),
    };
  }
}
