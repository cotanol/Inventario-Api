import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    // Validar que el vendedor existe
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorId: createClienteDto.vendedorId },
    });
    if (!vendedor) {
      throw new NotFoundException(
        `Vendedor con ID ${createClienteDto.vendedorId} no encontrado`,
      );
    }

    try {
      return await this.prisma.cliente.create({
        data: createClienteDto,
        include: { vendedor: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un cliente con ese RUC o email');
      }
      throw error;
    }
  }

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.cliente.findMany({
        include: { vendedor: true },
        orderBy: { nombre: 'asc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.cliente.count(),
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
    const cliente = await this.prisma.cliente.findUnique({
      where: { clienteId: id },
      include: { vendedor: true },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id);

    // Si se actualiza vendedorId, validar que exista
    if (updateClienteDto.vendedorId) {
      const vendedor = await this.prisma.vendedor.findUnique({
        where: { vendedorId: updateClienteDto.vendedorId },
      });
      if (!vendedor) {
        throw new NotFoundException(
          `Vendedor con ID ${updateClienteDto.vendedorId} no encontrado`,
        );
      }
    }

    try {
      return await this.prisma.cliente.update({
        where: { clienteId: id },
        data: updateClienteDto,
        include: { vendedor: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un cliente con ese RUC o email');
      }
      throw error;
    }
  }

  async changeStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOne(id);
    return await this.prisma.cliente.update({
      where: { clienteId: id },
      data: { estadoRegistro: changeStatusDto.estadoRegistro },
      include: { vendedor: true },
    });
  }
}
