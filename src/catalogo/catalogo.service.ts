import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateLineaDto,
  UpdateLineaDto,
  CreateGrupoDto,
  UpdateGrupoDto,
  CreateMarcaDto,
  UpdateMarcaDto,
  CreateProductoDto,
  UpdateProductoDto,
  ChangeStatusDto,
} from './dto';
import { Linea } from './entities/linea.entity';
import { Grupo } from './entities/grupo.entity';
import { Marca } from './entities/marca.entity';
import { Producto } from './entities/producto.entity';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // === CRUD LÍNEAS ===
  async createLinea(createLineaDto: CreateLineaDto): Promise<Linea> {
    try {
      const linea = this.lineaRepository.create(createLineaDto);
      return await this.lineaRepository.save(linea);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una línea con ese nombre');
      }
      throw error;
    }
  }

  async findAllLineas(): Promise<Linea[]> {
    return await this.lineaRepository.find({
      relations: ['grupos'],
      order: { nombre: 'ASC' },
    });
  }

  async findOneLinea(id: number): Promise<Linea> {
    const linea = await this.lineaRepository.findOne({
      where: { lineaId: id, estadoRegistro: true },
      relations: ['grupos'],
    });

    if (!linea) {
      throw new NotFoundException(`Línea con ID ${id} no encontrada`);
    }

    return linea;
  }

  async updateLinea(
    id: number,
    updateLineaDto: UpdateLineaDto,
  ): Promise<Linea> {
    const linea = await this.findOneLinea(id);

    try {
      Object.assign(linea, updateLineaDto);
      return await this.lineaRepository.save(linea);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una línea con ese nombre');
      }
      throw error;
    }
  }

  async changeLineaStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Linea> {
    const linea = await this.lineaRepository.findOne({
      where: { lineaId: id },
      relations: ['grupos'],
    });

    if (!linea) {
      throw new NotFoundException(`Línea con ID ${id} no encontrada`);
    }

    linea.estadoRegistro = changeStatusDto.estadoRegistro;
    return await this.lineaRepository.save(linea);
  }

  // === CRUD GRUPOS ===
  async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    // Verificar que la línea existe
    const linea = await this.findOneLinea(createGrupoDto.lineaId);

    try {
      const grupo = this.grupoRepository.create({
        ...createGrupoDto,
        linea,
      });
      return await this.grupoRepository.save(grupo);
    } catch (error) {
      throw error;
    }
  }

  async findAllGrupos(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      relations: ['linea', 'productos'],
      order: { nombre: 'ASC' },
    });
  }

  async findGruposByLinea(lineaId: number): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: {
        estadoRegistro: true,
        linea: { lineaId },
      },
      relations: ['linea', 'productos'],
      order: { nombre: 'ASC' },
    });
  }

  async findOneGrupo(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { grupoId: id, estadoRegistro: true },
      relations: ['linea', 'productos'],
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return grupo;
  }

  async updateGrupo(
    id: number,
    updateGrupoDto: UpdateGrupoDto,
  ): Promise<Grupo> {
    const grupo = await this.findOneGrupo(id);

    // Si se va a cambiar la línea, verificar que existe
    if (
      updateGrupoDto.lineaId &&
      updateGrupoDto.lineaId !== grupo.linea.lineaId
    ) {
      const nuevaLinea = await this.findOneLinea(updateGrupoDto.lineaId);
      grupo.linea = nuevaLinea;
    }

    try {
      Object.assign(grupo, {
        nombre: updateGrupoDto.nombre ?? grupo.nombre,
        estadoRegistro: updateGrupoDto.estadoRegistro ?? grupo.estadoRegistro,
      });
      return await this.grupoRepository.save(grupo);
    } catch (error) {
      throw error;
    }
  }

  async changeGrupoStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { grupoId: id },
      relations: ['linea', 'productos'],
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    grupo.estadoRegistro = changeStatusDto.estadoRegistro;
    return await this.grupoRepository.save(grupo);
  }

  // === CRUD MARCAS ===
  async createMarca(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    try {
      const marca = this.marcaRepository.create(createMarcaDto);
      return await this.marcaRepository.save(marca);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una marca con ese nombre');
      }
      throw error;
    }
  }

  async findAllMarcas(): Promise<Marca[]> {
    return await this.marcaRepository.find({
      relations: ['productos'],
      order: { nombre: 'ASC' },
    });
  }

  async findOneMarca(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { marcaId: id, estadoRegistro: true },
      relations: ['productos'],
    });

    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return marca;
  }

  async updateMarca(
    id: number,
    updateMarcaDto: UpdateMarcaDto,
  ): Promise<Marca> {
    const marca = await this.findOneMarca(id);

    try {
      Object.assign(marca, updateMarcaDto);
      return await this.marcaRepository.save(marca);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una marca con ese nombre');
      }
      throw error;
    }
  }

  async changeMarcaStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { marcaId: id },
      relations: ['productos'],
    });

    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    marca.estadoRegistro = changeStatusDto.estadoRegistro;
    return await this.marcaRepository.save(marca);
  }

  // === CRUD PRODUCTOS ===
  async createProducto(
    createProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    // Verificar que el grupo y la marca existen
    const grupo = await this.findOneGrupo(createProductoDto.grupoId);
    const marca = await this.findOneMarca(createProductoDto.marcaId);

    try {
      const producto = this.productoRepository.create({
        ...createProductoDto,
        grupo,
        marca,
      });
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un producto con ese código');
      }
      throw error;
    }
  }

  async findAllProductos(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['grupo', 'grupo.linea', 'marca'],
      order: { nombre: 'ASC' },
    });
  }

  async findOneProducto(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { productoId: id, estadoRegistro: true },
      relations: ['grupo', 'grupo.linea', 'marca'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async updateProducto(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOneProducto(id);

    // Si se va a cambiar el grupo, verificar que existe
    if (
      updateProductoDto.grupoId &&
      updateProductoDto.grupoId !== producto.grupo.grupoId
    ) {
      const nuevoGrupo = await this.findOneGrupo(updateProductoDto.grupoId);
      producto.grupo = nuevoGrupo;
    }

    // Si se va a cambiar la marca, verificar que existe
    if (
      updateProductoDto.marcaId &&
      updateProductoDto.marcaId !== producto.marca.marcaId
    ) {
      const nuevaMarca = await this.findOneMarca(updateProductoDto.marcaId);
      producto.marca = nuevaMarca;
    }

    try {
      Object.assign(producto, {
        codigo: updateProductoDto.codigo ?? producto.codigo,
        nombre: updateProductoDto.nombre ?? producto.nombre,
        descripcion: updateProductoDto.descripcion ?? producto.descripcion,
        precio: updateProductoDto.precio ?? producto.precio,
        estadoRegistro:
          updateProductoDto.estadoRegistro ?? producto.estadoRegistro,
      });
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un producto con ese código');
      }
      throw error;
    }
  }

  async changeProductoStatus(
    id: number,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { productoId: id },
      relations: ['grupo', 'grupo.linea', 'marca'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    producto.estadoRegistro = changeStatusDto.estadoRegistro;
    return await this.productoRepository.save(producto);
  }
}
