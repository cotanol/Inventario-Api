import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedor } from './entities/vendedor.entity';
import { CreateVendedorDto, UpdateVendedorDto, ChangeStatusDto } from './dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
  ) {}

  async create(createVendedorDto: CreateVendedorDto): Promise<Vendedor> {
    try {
      const vendedor = this.vendedorRepository.create(createVendedorDto);
      return await this.vendedorRepository.save(vendedor);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<Vendedor[]> {
    return await this.vendedorRepository.find({
      order: { vendedorId: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Vendedor> {
    const vendedor = await this.vendedorRepository.findOne({
      where: { vendedorId: id },
    });

    if (!vendedor) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado.`);
    }

    return vendedor;
  }

  async update(
    id: number,
    updateVendedorDto: UpdateVendedorDto,
  ): Promise<Vendedor> {
    const vendedor = await this.findOne(id);

    try {
      Object.assign(vendedor, updateVendedorDto);
      return await this.vendedorRepository.save(vendedor);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async changeStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<{ message: string }> {
    const { estadoRegistro } = changeStatusDto;
    const result = await this.vendedorRepository.update(id, { estadoRegistro });

    if (result.affected === 0) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado.`);
    }

    return {
      message: `Estado del vendedor actualizado a ${estadoRegistro ? 'activo' : 'inactivo'}.`,
    };
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      // Unique constraint violation
      throw new BadRequestException(
        error.detail || 'Ya existe un vendedor con ese DNI o correo.',
      );
    }

    console.error(error);
    throw new InternalServerErrorException(
      'Error inesperado. Revisa los logs del servidor.',
    );
  }
}
