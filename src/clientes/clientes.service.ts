import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Vendedor } from 'src/vendedores/entities/vendedor.entity';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const nuevoCliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(nuevoCliente);
    } catch (error) {
      // Código '23505' es para violaciones de unique constraint en PostgreSQL
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un cliente con ese RUC o email');
      }
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      relations: ['vendedor'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { clienteId: id },
      relations: ['vendedor'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    // Reutilizamos findOne para manejar la excepción si no existe
    const cliente = await this.findOne(id);

    // Si se está actualizando el vendedor, validar que exista
    if (
      updateClienteDto.vendedorId &&
      updateClienteDto.vendedorId !== cliente.vendedorId
    ) {
      const vendedor = await this.vendedorRepository.findOne({
        where: { vendedorId: updateClienteDto.vendedorId },
      });

      if (!vendedor) {
        throw new NotFoundException(
          `Vendedor con ID ${updateClienteDto.vendedorId} no encontrado`,
        );
      }

      cliente.vendedor = vendedor;
      cliente.vendedorId = vendedor.vendedorId;
    }

    try {
      // Actualizar los demás campos
      Object.assign(cliente, {
        nombre: updateClienteDto.nombre ?? cliente.nombre,
        ruc: updateClienteDto.ruc ?? cliente.ruc,
        direccion: updateClienteDto.direccion ?? cliente.direccion,
        telefono: updateClienteDto.telefono ?? cliente.telefono,
        email: updateClienteDto.email ?? cliente.email,
        clasificacion: updateClienteDto.clasificacion ?? cliente.clasificacion,
        departamento: updateClienteDto.departamento ?? cliente.departamento,
        provincia: updateClienteDto.provincia ?? cliente.provincia,
        distrito: updateClienteDto.distrito ?? cliente.distrito,
      });

      return await this.clienteRepository.save(cliente);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un cliente con ese RUC o email');
      }
      throw error;
    }
  }

  async changeStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);
    cliente.estadoRegistro = changeStatusDto.estadoRegistro;
    return await this.clienteRepository.save(cliente);
  }
}
