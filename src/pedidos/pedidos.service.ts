import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ReportsService } from 'src/reports/reports.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

import { ChangeEstadoPedidoDto, CreatePedidoDto, UpdatePedidoDto } from './dto';

const PEDIDO_INCLUDE = {
  cliente: true,
  vendedor: true,
  detalles: {
    include: {
      producto: true,
    },
  },
} satisfies Prisma.PedidoInclude;

@Injectable()
export class PedidosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsService: ReportsService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    await this.validateClienteExists(createPedidoDto.clienteId);
    await this.validateVendedorExists(createPedidoDto.vendedorId);

    const { totalNeto, detallesValidados } =
      await this.validateAndBuildDetalles(createPedidoDto.detalles);

    const pedidoCreado = await this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId: createPedidoDto.clienteId,
          vendedorId: createPedidoDto.vendedorId,
          tipoPago: createPedidoDto.tipoPago,
          subtotal: new Prisma.Decimal(totalNeto),
          igv: new Prisma.Decimal(0),
          total: new Prisma.Decimal(totalNeto),
          estado: 'PENDIENTE',
        },
      });

      await tx.detallePedido.createMany({
        data: detallesValidados.map((detalle) => ({
          pedidoId: pedido.pedidoId,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precioUnitario: new Prisma.Decimal(detalle.precioUnitario),
          subtotal: new Prisma.Decimal(detalle.subtotalLinea),
        })),
      });

      return tx.pedido.findUnique({
        where: { pedidoId: pedido.pedidoId },
        include: PEDIDO_INCLUDE,
      });
    });

    if (!pedidoCreado) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el pedido creado',
      );
    }

    return this.mapPedidoResponse(pedidoCreado);
  }

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [pedidos, totalItems] = await Promise.all([
      this.prisma.pedido.findMany({
        include: PEDIDO_INCLUDE,
        orderBy: { pedidoId: 'desc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.pedido.count(),
    ]);

    return {
      items: pedidos.map((pedido) => this.mapPedidoResponse(pedido)),
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: pedidos.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { pedidoId: id },
      include: PEDIDO_INCLUDE,
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return this.mapPedidoResponse(pedido);
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);

    if (pedido.estadoPedido !== 'PENDIENTE') {
      throw new BadRequestException(
        'Solo se pueden actualizar pedidos en estado PENDIENTE',
      );
    }

    if (updatePedidoDto.clienteId) {
      await this.validateClienteExists(updatePedidoDto.clienteId);
    }

    if (updatePedidoDto.vendedorId) {
      await this.validateVendedorExists(updatePedidoDto.vendedorId);
    }

    let detallesValidados: Array<{
      productoId: number;
      cantidad: number;
      precioUnitario: number;
      subtotalLinea: number;
      producto: {
        nombre: string;
        estadoRegistro: boolean;
      };
    }> | null = null;

    let totalNeto: number | null = null;

    if (updatePedidoDto.detalles && updatePedidoDto.detalles.length > 0) {
      const detallesResult = await this.validateAndBuildDetalles(
        updatePedidoDto.detalles,
      );
      detallesValidados = detallesResult.detallesValidados;
      totalNeto = detallesResult.totalNeto;
    }

    const pedidoActualizado = await this.prisma.$transaction(async (tx) => {
      await tx.pedido.update({
        where: { pedidoId: id },
        data: {
          clienteId: updatePedidoDto.clienteId,
          vendedorId: updatePedidoDto.vendedorId,
          tipoPago: updatePedidoDto.tipoPago,
          subtotal:
            totalNeto !== null ? new Prisma.Decimal(totalNeto) : undefined,
          total: totalNeto !== null ? new Prisma.Decimal(totalNeto) : undefined,
        },
      });

      if (detallesValidados) {
        await tx.detallePedido.deleteMany({
          where: { pedidoId: id },
        });

        await tx.detallePedido.createMany({
          data: detallesValidados.map((detalle) => ({
            pedidoId: id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: new Prisma.Decimal(detalle.precioUnitario),
            subtotal: new Prisma.Decimal(detalle.subtotalLinea),
          })),
        });
      }

      return tx.pedido.findUnique({
        where: { pedidoId: id },
        include: PEDIDO_INCLUDE,
      });
    });

    if (!pedidoActualizado) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el pedido actualizado',
      );
    }

    return this.mapPedidoResponse(pedidoActualizado);
  }

  async changeEstado(id: number, changeEstadoDto: ChangeEstadoPedidoDto) {
    const pedidoActual = await this.findOne(id);

    if (pedidoActual.estadoPedido === 'COMPLETADO') {
      throw new BadRequestException(
        'No se puede cambiar el estado de un pedido completado',
      );
    }

    if (pedidoActual.estadoPedido === 'CANCELADO') {
      throw new BadRequestException(
        'No se puede cambiar el estado de un pedido cancelado',
      );
    }

    const nuevoEstado = changeEstadoDto.estadoPedido;

    if (nuevoEstado === 'COMPLETADO') {
      return this.completePedidoAndUpdateEstado(id);
    }

    const pedido = await this.prisma.pedido.update({
      where: { pedidoId: id },
      data: {
        estado: nuevoEstado,
      },
      include: PEDIDO_INCLUDE,
    });

    return this.mapPedidoResponse(pedido);
  }

  private async completePedidoAndUpdateEstado(id: number) {
    let pedidoCompleto: Prisma.PedidoGetPayload<{
      include: typeof PEDIDO_INCLUDE;
    }> | null = null;

    pedidoCompleto = await this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { pedidoId: id },
        include: PEDIDO_INCLUDE,
      });

      if (!pedido) {
        throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
      }

      for (const detalle of pedido.detalles) {
        const inventario = await tx.inventario.findUnique({
          where: { productoId: detalle.productoId },
        });

        if (!inventario) {
          throw new BadRequestException(
            `El producto ${detalle.producto.nombre} no tiene inventario configurado`,
          );
        }

        if (inventario.cantidadActual < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${detalle.producto.nombre}. Disponible: ${inventario.cantidadActual}, Solicitado: ${detalle.cantidad}`,
          );
        }
      }

      for (const detalle of pedido.detalles) {
        await tx.inventario.update({
          where: { productoId: detalle.productoId },
          data: {
            cantidadActual: {
              decrement: detalle.cantidad,
            },
          },
        });

        const producto = await tx.producto.findUnique({
          where: { productoId: detalle.productoId },
          select: { costoUnitario: true },
        });

        await tx.movimientoInventario.create({
          data: {
            productoId: detalle.productoId,
            tipo: 'SALIDA',
            cantidad: detalle.cantidad,
            documentoReferenciaId: pedido.pedidoId,
            origenMovimiento: 'PEDIDO',
            costoUnitario: producto?.costoUnitario ?? new Prisma.Decimal(0),
          },
        });
      }

      return tx.pedido.update({
        where: { pedidoId: id },
        data: {
          estado: 'COMPLETADO',
        },
        include: PEDIDO_INCLUDE,
      });
    });

    if (!pedidoCompleto) {
      throw new InternalServerErrorException(
        'No se pudo completar el pedido correctamente',
      );
    }

    let pdfUrl: string | null = null;

    try {
      pdfUrl = await this.reportsService.saveNotaPedidoReport(
        this.mapPedidoResponse(pedidoCompleto),
      );
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }

    if (pdfUrl) {
      pedidoCompleto = await this.prisma.pedido.update({
        where: { pedidoId: id },
        data: {
          pdfUrl,
        },
        include: PEDIDO_INCLUDE,
      });
    }

    return this.mapPedidoResponse(pedidoCompleto);
  }

  private async validateAndBuildDetalles(
    detalles: Array<{
      productoId: number;
      cantidad: number;
    }>,
  ) {
    let totalNeto = 0;

    const detallesValidados: Array<{
      productoId: number;
      cantidad: number;
      precioUnitario: number;
      subtotalLinea: number;
      producto: {
        nombre: string;
        estadoRegistro: boolean;
      };
    }> = [];

    for (const detalle of detalles) {
      const producto = await this.prisma.producto.findUnique({
        where: { productoId: detalle.productoId },
        select: {
          productoId: true,
          nombre: true,
          precioVenta: true,
          estadoRegistro: true,
        },
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalle.productoId} no encontrado`,
        );
      }

      if (!producto.estadoRegistro) {
        throw new BadRequestException(
          `El producto ${producto.nombre} esta inactivo`,
        );
      }

      const precioUnitario = Number(producto.precioVenta);
      const subtotalLinea = precioUnitario * detalle.cantidad;
      totalNeto += subtotalLinea;

      detallesValidados.push({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario,
        subtotalLinea,
        producto: {
          nombre: producto.nombre,
          estadoRegistro: producto.estadoRegistro,
        },
      });
    }

    return {
      totalNeto,
      detallesValidados,
    };
  }

  private async validateClienteExists(clienteId: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { clienteId },
      select: { clienteId: true },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }
  }

  private async validateVendedorExists(vendedorId: number) {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorId },
      select: { vendedorId: true },
    });

    if (!vendedor) {
      throw new NotFoundException(
        `Vendedor con ID ${vendedorId} no encontrado`,
      );
    }
  }

  private mapPedidoResponse(
    pedido: Prisma.PedidoGetPayload<{ include: typeof PEDIDO_INCLUDE }>,
  ) {
    const detalles = pedido.detalles.map((detalle) => {
      const inventario = (
        detalle.producto as unknown as { inventario?: unknown }
      ).inventario;

      return {
        detalleId: detalle.detalleId,
        productoId: detalle.productoId,
        producto: {
          ...detalle.producto,
          precioVenta: Number(detalle.producto.precioVenta),
          costoReferencial: Number(detalle.producto.costoUnitario),
          fechaModificacion: detalle.producto.fechaActualizacion,
          inventario: inventario ?? null,
        },
        cantidad: detalle.cantidad,
        precioUnitario: Number(detalle.precioUnitario),
        subtotalLinea: Number(detalle.subtotal),
      };
    });

    return {
      pedidoId: pedido.pedidoId,
      clienteId: pedido.clienteId,
      cliente: pedido.cliente,
      vendedorId: pedido.vendedorId,
      vendedor: pedido.vendedor,
      tipoPago: pedido.tipoPago,
      totalNeto: Number(pedido.subtotal),
      totalFinal: Number(pedido.total),
      urlPdf: pedido.pdfUrl,
      estadoPedido: pedido.estado,
      estadoRegistro: pedido.estadoRegistro,
      fechaCreacion: pedido.fechaCreacion,
      fechaModificacion: pedido.fechaActualizacion,
      detalles,
    };
  }
}
