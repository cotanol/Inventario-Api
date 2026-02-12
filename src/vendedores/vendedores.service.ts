import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVendedorDto, UpdateVendedorDto, ChangeStatusDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VendedoresService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createVendedorDto: CreateVendedorDto) {
    try {
      return await this.prisma.vendedor.create({
        data: createVendedorDto,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll() {
    return await this.prisma.vendedor.findMany({
      orderBy: { vendedorId: 'asc' },
    });
  }

  async findOne(id: number) {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorId: id },
    });

    if (!vendedor) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado.`);
    }

    return vendedor;
  }

  async update(id: number, updateVendedorDto: UpdateVendedorDto) {
    await this.findOne(id);

    try {
      return await this.prisma.vendedor.update({
        where: { vendedorId: id },
        data: updateVendedorDto,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async changeStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<{ message: string }> {
    const { estadoRegistro } = changeStatusDto;

    await this.findOne(id);

    await this.prisma.vendedor.update({
      where: { vendedorId: id },
      data: { estadoRegistro },
    });

    return {
      message: `Estado del vendedor actualizado a ${estadoRegistro ? 'activo' : 'inactivo'}.`,
    };
  }

  private handleDBError(error: any): never {
    if (error.code === 'P2002') {
      throw new BadRequestException(
        error.meta?.target?.join(', ') ||
        'Ya existe un vendedor con ese DNI o correo.',
      );
    }

    console.error(error);
    throw new InternalServerErrorException(
      'Error inesperado. Revisa los logs del servidor.',
    );
  }
}
