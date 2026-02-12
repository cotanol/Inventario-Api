import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) { }

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
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un cliente con ese RUC o email');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.cliente.findMany({
      include: { vendedor: true },
      orderBy: { nombre: 'asc' },
    });
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
      if (error.code === 'P2002') {
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
