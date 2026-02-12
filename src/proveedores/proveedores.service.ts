import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProveedorDto: CreateProveedorDto) {
    return await this.prisma.proveedor.create({
      data: createProveedorDto,
    });
  }

  async findAll() {
    return await this.prisma.proveedor.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });
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

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.proveedor.delete({
      where: { proveedorId: id },
    });
  }
}
