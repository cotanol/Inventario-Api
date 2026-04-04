import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { CreateProveedorDto, UpdateProveedorDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProveedorDto: CreateProveedorDto) {
    return await this.prisma.proveedor.create({
      data: createProveedorDto,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.proveedor.findMany({
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.proveedor.count(),
    ]);

    return {
      items,
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: items.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async findOne(id: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { proveedorId: id },
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    await this.findOne(id);
    return await this.prisma.proveedor.update({
      where: { proveedorId: id },
      data: updateProveedorDto,
    });
  }

  async changeStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOne(id);

    await this.prisma.proveedor.update({
      where: { proveedorId: id },
      data: { estadoRegistro: changeStatusDto.estadoRegistro },
    });

    return {
      message: `Estado del proveedor actualizado a ${changeStatusDto.estadoRegistro ? 'activo' : 'inactivo'}.`,
    };
  }
}
