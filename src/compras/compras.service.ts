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

import { CreateCompraDto } from './dto/create-compra.dto';
import {
  ConfirmarOrdenDto,
  RecibirMercaderiaDto,
  UpdateCompraDto,
} from './dto/update-compra.dto';

const COMPRA_INCLUDE = {
  proveedor: true,
  detalles: {
    include: {
      producto: true,
    },
  },
} satisfies Prisma.CompraInclude;

@Injectable()
export class ComprasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsService: ReportsService,
  ) {}

  async create(createCompraDto: CreateCompraDto) {
    await this.validateProveedorExists(createCompraDto.proveedorId);

    const { totalCompra, detallesValidados } =
      await this.validateAndBuildDetalles(createCompraDto.detalles);

    const compra = await this.prisma.$transaction(async (tx) => {
      const createdCompra = await tx.compra.create({
        data: {
          proveedorId: createCompraDto.proveedorId,
          fechaOrden: new Date(createCompraDto.fechaOrden),
          fechaEntregaEstimada: createCompraDto.fechaLlegadaEstimada
            ? new Date(createCompraDto.fechaLlegadaEstimada)
            : undefined,
          estado: createCompraDto.estadoCompra ?? 'BORRADOR',
          total: new Prisma.Decimal(totalCompra),
        },
      });

      await tx.detalleCompra.createMany({
        data: detallesValidados.map((detalle) => ({
          compraId: createdCompra.compraId,
          productoId: detalle.productoId,
          cantidadSolicitada: detalle.cantidadSolicitada,
          cantidadRecibida: 0,
          costoUnitario: new Prisma.Decimal(detalle.costoUnitario),
          subtotal: new Prisma.Decimal(detalle.subtotal),
        })),
      });

      return tx.compra.findUnique({
        where: { compraId: createdCompra.compraId },
        include: COMPRA_INCLUDE,
      });
    });

    if (!compra) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra creada',
      );
    }

    return this.mapCompraResponse(compra);
  }

  async findAll(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [compras, totalItems] = await Promise.all([
      this.prisma.compra.findMany({
        include: COMPRA_INCLUDE,
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.compra.count(),
    ]);

    return {
      items: compras.map((compra) => this.mapCompraResponse(compra)),
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: compras.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async findOne(id: number) {
    const compra = await this.prisma.compra.findUnique({
      where: { compraId: id },
      include: COMPRA_INCLUDE,
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return this.mapCompraResponse(compra);
  }

  async update(id: number, updateCompraDto: UpdateCompraDto) {
    const compra = await this.findOne(id);

    if (compra.estadoCompra === 'COMPLETADO') {
      throw new BadRequestException(
        'No se puede modificar una compra completada',
      );
    }

    if (compra.estadoCompra === 'CANCELADO') {
      throw new BadRequestException(
        'No se puede modificar una compra cancelada',
      );
    }

    if (
      compra.estadoCompra !== 'BORRADOR' &&
      compra.estadoCompra !== 'ORDENADO'
    ) {
      throw new BadRequestException(
        'Solo se pueden editar compras en estado BORRADOR u ORDENADO',
      );
    }

    if (updateCompraDto.proveedorId) {
      await this.validateProveedorExists(updateCompraDto.proveedorId);
    }

    if (compra.estadoCompra === 'ORDENADO') {
      const updated = await this.prisma.compra.update({
        where: { compraId: id },
        data: {
          fechaEntregaEstimada:
            updateCompraDto.fechaLlegadaEstimada !== undefined
              ? updateCompraDto.fechaLlegadaEstimada
                ? new Date(updateCompraDto.fechaLlegadaEstimada)
                : null
              : undefined,
        },
        include: COMPRA_INCLUDE,
      });

      return this.mapCompraResponse(updated);
    }

    let detallesValidados: Array<{
      productoId: number;
      cantidadSolicitada: number;
      costoUnitario: number;
      subtotal: number;
    }> | null = null;

    let totalCompra: number | null = null;

    if (updateCompraDto.detalles && updateCompraDto.detalles.length > 0) {
      const detallesResult = await this.validateAndBuildDetalles(
        updateCompraDto.detalles,
      );
      detallesValidados = detallesResult.detallesValidados;
      totalCompra = detallesResult.totalCompra;
    }

    const compraActualizada = await this.prisma.$transaction(async (tx) => {
      await tx.compra.update({
        where: { compraId: id },
        data: {
          proveedorId: updateCompraDto.proveedorId,
          fechaOrden: updateCompraDto.fechaOrden
            ? new Date(updateCompraDto.fechaOrden)
            : undefined,
          fechaEntregaEstimada:
            updateCompraDto.fechaLlegadaEstimada !== undefined
              ? updateCompraDto.fechaLlegadaEstimada
                ? new Date(updateCompraDto.fechaLlegadaEstimada)
                : null
              : undefined,
          total:
            totalCompra !== null ? new Prisma.Decimal(totalCompra) : undefined,
        },
      });

      if (detallesValidados) {
        await tx.detalleCompra.deleteMany({
          where: { compraId: id },
        });

        await tx.detalleCompra.createMany({
          data: detallesValidados.map((detalle) => ({
            compraId: id,
            productoId: detalle.productoId,
            cantidadSolicitada: detalle.cantidadSolicitada,
            cantidadRecibida: 0,
            costoUnitario: new Prisma.Decimal(detalle.costoUnitario),
            subtotal: new Prisma.Decimal(detalle.subtotal),
          })),
        });
      }

      return tx.compra.findUnique({
        where: { compraId: id },
        include: COMPRA_INCLUDE,
      });
    });

    if (!compraActualizada) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra actualizada',
      );
    }

    return this.mapCompraResponse(compraActualizada);
  }

  async remove(id: number): Promise<void> {
    const compra = await this.findOne(id);

    if (compra.estadoCompra !== 'BORRADOR') {
      throw new BadRequestException(
        'Solo se pueden eliminar compras en estado BORRADOR',
      );
    }

    await this.prisma.compra.delete({
      where: { compraId: id },
    });
  }

  async confirmarOrden(id: number, confirmarOrdenDto: ConfirmarOrdenDto) {
    const compra = await this.findOne(id);

    if (compra.estadoCompra !== 'BORRADOR') {
      throw new BadRequestException(
        'Solo se pueden confirmar compras en estado BORRADOR',
      );
    }

    if (!compra.detalles || compra.detalles.length === 0) {
      throw new BadRequestException(
        'La compra debe tener al menos un producto',
      );
    }

    const compraOrdenada = await this.prisma.compra.update({
      where: { compraId: id },
      data: {
        estado: 'ORDENADO',
        fechaEntregaEstimada: confirmarOrdenDto.fechaLlegadaEstimada
          ? new Date(confirmarOrdenDto.fechaLlegadaEstimada)
          : undefined,
      },
      include: COMPRA_INCLUDE,
    });

    let pdfUrl: string | null = null;

    try {
      pdfUrl = await this.reportsService.saveOrdenCompraReport(
        this.mapCompraResponse(compraOrdenada),
      );
    } catch (error) {
      console.error('Error al generar PDF de Orden de Compra:', error);
    }

    if (pdfUrl) {
      const withPdf = await this.prisma.compra.update({
        where: { compraId: id },
        data: {
          pdfUrl,
        },
        include: COMPRA_INCLUDE,
      });

      return this.mapCompraResponse(withPdf);
    }

    return this.mapCompraResponse(compraOrdenada);
  }

  async marcarEnTransito(id: number, fechaLlegadaEstimada?: string) {
    const compra = await this.findOne(id);

    if (compra.estadoCompra !== 'ORDENADO') {
      throw new BadRequestException(
        'Solo se pueden marcar en transito compras en estado ORDENADO',
      );
    }

    const updated = await this.prisma.compra.update({
      where: { compraId: id },
      data: {
        estado: 'EN_TRANSITO',
        fechaEntregaEstimada: fechaLlegadaEstimada
          ? new Date(fechaLlegadaEstimada)
          : undefined,
      },
      include: COMPRA_INCLUDE,
    });

    return this.mapCompraResponse(updated);
  }

  async recibirMercaderia(
    id: number,
    recibirMercaderiaDto: RecibirMercaderiaDto,
  ) {
    const compra = await this.findOne(id);

    if (compra.estadoCompra !== 'EN_TRANSITO') {
      throw new BadRequestException(
        'Solo se pueden recibir compras en estado EN_TRANSITO',
      );
    }

    const compraActualizada = await this.prisma.$transaction(async (tx) => {
      for (const detalleRecibido of recibirMercaderiaDto.detalles) {
        const detalle = await tx.detalleCompra.findUnique({
          where: { detalleId: detalleRecibido.detalleCompraId },
          include: {
            producto: true,
          },
        });

        if (!detalle || detalle.compraId !== id) {
          throw new NotFoundException(
            `Detalle de compra ${detalleRecibido.detalleCompraId} no encontrado`,
          );
        }

        if (detalleRecibido.cantidadRecibida > detalle.cantidadSolicitada) {
          throw new BadRequestException(
            `No se puede recibir mas de lo solicitado para el producto ${detalle.productoId}`,
          );
        }

        await tx.detalleCompra.update({
          where: { detalleId: detalle.detalleId },
          data: {
            cantidadRecibida: detalleRecibido.cantidadRecibida,
          },
        });

        await tx.movimientoInventario.create({
          data: {
            productoId: detalle.productoId,
            tipo: 'ENTRADA',
            origenMovimiento: 'COMPRA',
            documentoReferenciaId: id,
            cantidad: detalleRecibido.cantidadRecibida,
            costoUnitario: detalle.costoUnitario,
          },
        });

        await tx.inventario.update({
          where: { productoId: detalle.productoId },
          data: {
            cantidadActual: {
              increment: detalleRecibido.cantidadRecibida,
            },
          },
        });

        await tx.producto.update({
          where: { productoId: detalle.productoId },
          data: {
            costoUnitario: detalle.costoUnitario,
          },
        });
      }

      return tx.compra.update({
        where: { compraId: id },
        data: {
          estado: 'COMPLETADO',
        },
        include: COMPRA_INCLUDE,
      });
    });

    return this.mapCompraResponse(compraActualizada);
  }

  async cancelarCompra(id: number) {
    const compra = await this.findOne(id);

    if (compra.estadoCompra === 'COMPLETADO') {
      throw new BadRequestException(
        'No se puede cancelar una compra que ya ha sido completada. Si necesita revertir el inventario, debe hacer un ajuste manual.',
      );
    }

    if (compra.estadoCompra === 'CANCELADO') {
      throw new BadRequestException('La compra ya esta cancelada');
    }

    const updated = await this.prisma.compra.update({
      where: { compraId: id },
      data: {
        estado: 'CANCELADO',
      },
      include: COMPRA_INCLUDE,
    });

    return this.mapCompraResponse(updated);
  }

  private async validateProveedorExists(proveedorId: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { proveedorId },
      select: { proveedorId: true },
    });

    if (!proveedor) {
      throw new NotFoundException(
        `Proveedor con ID ${proveedorId} no encontrado`,
      );
    }
  }

  private async validateAndBuildDetalles(
    detalles: Array<{
      productoId: number;
      cantidadSolicitada: number;
      costoUnitario: number;
    }>,
  ) {
    let totalCompra = 0;

    const detallesValidados: Array<{
      productoId: number;
      cantidadSolicitada: number;
      costoUnitario: number;
      subtotal: number;
    }> = [];

    for (const detalleDto of detalles) {
      const producto = await this.prisma.producto.findUnique({
        where: { productoId: detalleDto.productoId },
        select: {
          productoId: true,
        },
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalleDto.productoId} no encontrado`,
        );
      }

      const subtotal = detalleDto.cantidadSolicitada * detalleDto.costoUnitario;
      totalCompra += subtotal;

      detallesValidados.push({
        productoId: detalleDto.productoId,
        cantidadSolicitada: detalleDto.cantidadSolicitada,
        costoUnitario: detalleDto.costoUnitario,
        subtotal,
      });
    }

    return { totalCompra, detallesValidados };
  }

  private mapCompraResponse(
    compra: Prisma.CompraGetPayload<{ include: typeof COMPRA_INCLUDE }>,
  ) {
    const detalles = compra.detalles.map((detalle) => {
      const inventario = (
        detalle.producto as unknown as { inventario?: unknown }
      ).inventario;

      return {
        detalleCompraId: detalle.detalleId,
        productoId: detalle.productoId,
        producto: {
          ...detalle.producto,
          precioVenta: Number(detalle.producto.precioVenta),
          costoReferencial: Number(detalle.producto.costoUnitario),
          fechaModificacion: detalle.producto.fechaActualizacion,
          inventario: inventario ?? null,
        },
        cantidadSolicitada: detalle.cantidadSolicitada,
        cantidadRecibida: detalle.cantidadRecibida,
        costoUnitario: Number(detalle.costoUnitario),
        subtotal: Number(detalle.subtotal),
      };
    });

    return {
      compraId: compra.compraId,
      proveedorId: compra.proveedorId,
      proveedor: compra.proveedor,
      fechaOrden: compra.fechaOrden,
      fechaLlegadaEstimada: compra.fechaEntregaEstimada,
      estadoCompra: compra.estado,
      totalCompra: Number(compra.total),
      urlPdf: compra.pdfUrl,
      estadoRegistro: compra.estadoRegistro,
      fechaCreacion: compra.fechaCreacion,
      fechaModificacion: compra.fechaActualizacion,
      detalles,
    };
  }
}
