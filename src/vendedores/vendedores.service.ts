import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { CreateVendedorDto, UpdateVendedorDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class VendedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVendedorDto: CreateVendedorDto) {
    return this.prisma.vendedor.create({
      data: createVendedorDto,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.vendedor.findMany({
        orderBy: { vendedorId: 'asc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.vendedor.count(),
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

    return this.prisma.vendedor.update({
      where: { vendedorId: id },
      data: updateVendedorDto,
    });
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
}
