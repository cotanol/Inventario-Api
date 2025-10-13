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
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
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
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { clienteId: id },
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

    try {
      // merge actualiza la entidad encontrada con los nuevos datos
      this.clienteRepository.merge(cliente, updateClienteDto);
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
