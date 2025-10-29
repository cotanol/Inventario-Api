import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido, DetallePedido } from './entities';
import { estadoPedido } from './entities/pedido.entity';
import { CreatePedidoDto, ChangeEstadoPedidoDto, UpdatePedidoDto } from './dto';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Vendedor } from 'src/vendedores/entities/vendedor.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import {
  MovimientoInventario,
  TipoMovimientoInventario,
} from 'src/inventario/entities/movimiento-inventario.entity';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(MovimientoInventario)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventario>,
    private readonly dataSource: DataSource,
    private readonly reportsService: ReportsService,
  ) {}

  /**
   * Crea un nuevo pedido en estado PENDIENTE
   * No afecta el inventario hasta que se complete
   */
  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Validar que el cliente existe
    const cliente = await this.clienteRepository.findOne({
      where: { clienteId: createPedidoDto.clienteId },
    });
    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createPedidoDto.clienteId} no encontrado`,
      );
    }

    // Validar que el vendedor existe
    const vendedor = await this.vendedorRepository.findOne({
      where: { vendedorId: createPedidoDto.vendedorId },
    });
    if (!vendedor) {
      throw new NotFoundException(
        `Vendedor con ID ${createPedidoDto.vendedorId} no encontrado`,
      );
    }

    // Validar que todos los productos existen y calcular totales
    let totalNeto = 0;
    const detallesValidados: Array<{
      productoId: number;
      cantidad: number;
      precioUnitario: number;
      subtotalLinea: number;
    }> = [];

    for (const detalle of createPedidoDto.detalles) {
      const producto = await this.productoRepository.findOne({
        where: { productoId: detalle.productoId },
        relations: ['inventario'],
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalle.productoId} no encontrado`,
        );
      }

      if (!producto.estadoRegistro) {
        throw new BadRequestException(
          `El producto ${producto.nombre} está inactivo`,
        );
      }

      const subtotal = producto.precio * detalle.cantidad;
      totalNeto += subtotal;

      detallesValidados.push({
        productoId: producto.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: producto.precio,
        subtotalLinea: subtotal,
      });
    }

    // Calcular total final (puedes agregar impuestos aquí si es necesario)
    const totalFinal = totalNeto; // Por ahora sin impuestos

    // Crear el pedido usando transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear el pedido
      const nuevoPedido = this.pedidoRepository.create({
        clienteId: createPedidoDto.clienteId,
        vendedorId: createPedidoDto.vendedorId,
        tipoPago: createPedidoDto.tipoPago,
        totalNeto,
        totalFinal,
        estadoPedido: estadoPedido.PENDIENTE,
        estadoRegistro: true,
      });

      const pedidoGuardado = await queryRunner.manager.save(nuevoPedido);

      // Crear los detalles del pedido
      for (const detalle of detallesValidados) {
        const nuevoDetalle = this.detallePedidoRepository.create({
          pedidoId: pedidoGuardado.pedidoId,
          ...detalle,
        });
        await queryRunner.manager.save(nuevoDetalle);
      }

      await queryRunner.commitTransaction();

      // Retornar el pedido completo con sus relaciones
      return this.findOne(pedidoGuardado.pedidoId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene todos los pedidos
   */
  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: ['cliente', 'vendedor', 'detalles', 'detalles.producto'],
      order: { pedidoId: 'DESC' },
    });
  }

  /**
   * Obtiene un pedido por ID
   */
  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { pedidoId: id },
      relations: ['cliente', 'vendedor', 'detalles', 'detalles.producto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  /**
   * Actualiza un pedido (solo si está en estado PENDIENTE)
   * Permite cambiar cliente, vendedor, tipo de pago y productos
   */
  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    // Solo se pueden actualizar pedidos en estado PENDIENTE
    if (pedido.estadoPedido !== estadoPedido.PENDIENTE) {
      throw new BadRequestException(
        'Solo se pueden actualizar pedidos en estado PENDIENTE',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Si se está cambiando el cliente, validar que existe
      if (updatePedidoDto.clienteId) {
        const cliente = await this.clienteRepository.findOne({
          where: { clienteId: updatePedidoDto.clienteId },
        });
        if (!cliente) {
          throw new NotFoundException(
            `Cliente con ID ${updatePedidoDto.clienteId} no encontrado`,
          );
        }
        pedido.clienteId = updatePedidoDto.clienteId;
      }

      // Si se está cambiando el vendedor, validar que existe
      if (updatePedidoDto.vendedorId) {
        const vendedor = await this.vendedorRepository.findOne({
          where: { vendedorId: updatePedidoDto.vendedorId },
        });
        if (!vendedor) {
          throw new NotFoundException(
            `Vendedor con ID ${updatePedidoDto.vendedorId} no encontrado`,
          );
        }
        pedido.vendedorId = updatePedidoDto.vendedorId;
      }

      // Si se está cambiando el tipo de pago
      if (updatePedidoDto.tipoPago) {
        pedido.tipoPago = updatePedidoDto.tipoPago;
      }

      // Si se están actualizando los detalles
      if (updatePedidoDto.detalles && updatePedidoDto.detalles.length > 0) {
        // Eliminar los detalles actuales
        await queryRunner.manager.delete(DetallePedido, {
          pedidoId: pedido.pedidoId,
        });

        // Validar y crear nuevos detalles
        let totalNeto = 0;

        for (const detalle of updatePedidoDto.detalles) {
          const producto = await this.productoRepository.findOne({
            where: { productoId: detalle.productoId },
            relations: ['inventario'],
          });

          if (!producto) {
            throw new NotFoundException(
              `Producto con ID ${detalle.productoId} no encontrado`,
            );
          }

          if (!producto.estadoRegistro) {
            throw new BadRequestException(
              `El producto ${producto.nombre} está inactivo`,
            );
          }

          const subtotal = producto.precio * detalle.cantidad;
          totalNeto += subtotal;

          // Insertar directamente con queryRunner
          await queryRunner.manager.insert(DetallePedido, {
            pedidoId: pedido.pedidoId,
            productoId: producto.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: producto.precio,
            subtotalLinea: subtotal,
          });
        }

        // Actualizar totales
        pedido.totalNeto = totalNeto;
        pedido.totalFinal = totalNeto; // Por ahora sin impuestos
      }

      // Actualizar el pedido usando update() para evitar problemas con las relaciones
      await queryRunner.manager.update(Pedido, pedido.pedidoId, {
        clienteId: pedido.clienteId,
        vendedorId: pedido.vendedorId,
        tipoPago: pedido.tipoPago,
        totalNeto: pedido.totalNeto,
        totalFinal: pedido.totalFinal,
      });

      await queryRunner.commitTransaction();

      // Retornar el pedido actualizado con sus relaciones
      return this.findOne(pedido.pedidoId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cambia el estado del pedido
   * - COMPLETADO: Descuenta del inventario y crea movimientos
   * - CANCELADO: No afecta el inventario
   */
  async changeEstado(
    id: number,
    changeEstadoDto: ChangeEstadoPedidoDto,
  ): Promise<Pedido> {
    const pedido = await this.findOne(id);

    // Validar transiciones de estado
    if (pedido.estadoPedido === estadoPedido.COMPLETADO) {
      throw new BadRequestException(
        'No se puede cambiar el estado de un pedido completado',
      );
    }

    if (pedido.estadoPedido === estadoPedido.CANCELADO) {
      throw new BadRequestException(
        'No se puede cambiar el estado de un pedido cancelado',
      );
    }

    const nuevoEstado = changeEstadoDto.estadoPedido as estadoPedido;

    // Si se está completando el pedido, validar stock y afectar inventario
    if (nuevoEstado === estadoPedido.COMPLETADO) {
      await this.completarPedido(pedido);

      // Generar el PDF de nota de pedido
      try {
        const pdfUrl = await this.reportsService.saveNotaPedidoReport(pedido);
        pedido.urlPdf = pdfUrl;
      } catch (error) {
        console.error('Error al generar PDF:', error);
        // No lanzamos error, solo log. El pedido se completa de todas formas
      }
    }

    // Actualizar estado
    pedido.estadoPedido = nuevoEstado;
    return this.pedidoRepository.save(pedido);
  }

  /**
   * Completa un pedido: valida stock y descuenta del inventario
   */
  private async completarPedido(pedido: Pedido): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar stock de todos los productos
      for (const detalle of pedido.detalles) {
        const inventario = await queryRunner.manager.findOne(Inventario, {
          where: { producto: { productoId: detalle.productoId } },
          relations: ['producto'],
        });

        if (!inventario) {
          throw new BadRequestException(
            `El producto ${detalle.producto.nombre} no tiene inventario configurado`,
          );
        }

        if (inventario.cantidadActual < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${detalle.producto.nombre}. ` +
              `Disponible: ${inventario.cantidadActual}, Solicitado: ${detalle.cantidad}`,
          );
        }
      }

      // Descontar del inventario y crear movimientos
      for (const detalle of pedido.detalles) {
        // Buscar el inventario del producto
        const inventario = await queryRunner.manager.findOne(Inventario, {
          where: { producto: { productoId: detalle.productoId } },
          relations: ['producto'],
        });

        if (!inventario) {
          throw new BadRequestException(
            `Inventario no encontrado para el producto ${detalle.producto.nombre}`,
          );
        }

        // Actualizar cantidad actual
        inventario.cantidadActual -= detalle.cantidad;
        await queryRunner.manager.save(inventario);

        // Crear movimiento de salida
        const movimiento = this.movimientoInventarioRepository.create({
          productoId: detalle.productoId,
          tipoMovimiento: TipoMovimientoInventario.SALIDA,
          cantidad: detalle.cantidad,
          pedidoId: pedido.pedidoId,
        });
        await queryRunner.manager.save(movimiento);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
