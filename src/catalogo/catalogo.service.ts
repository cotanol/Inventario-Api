import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import {
  ChangeStatusDto,
  CreateGrupoDto,
  CreateLineaDto,
  CreateMarcaDto,
  CreateProductoDto,
  UpdateGrupoDto,
  UpdateLineaDto,
  UpdateMarcaDto,
  UpdateProductoDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class CatalogoService {
  constructor(private readonly prisma: PrismaService) {}

  async createLinea(createLineaDto: CreateLineaDto) {
    try {
      return await this.prisma.linea.create({
        data: {
          nombre: createLineaDto.nombre,
          estadoRegistro: createLineaDto.estadoRegistro,
        },
        include: {
          grupos: true,
        },
      });
    } catch (error) {
      this.handleDBError(error, 'Ya existe una linea con ese nombre');
    }
  }

  async findAllLineas(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.linea.findMany({
        include: {
          grupos: true,
        },
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.linea.count(),
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

  async findOneLinea(id: number) {
    const linea = await this.prisma.linea.findUnique({
      where: {
        lineaId: id,
      },
      include: {
        grupos: true,
      },
    });

    if (!linea) {
      throw new NotFoundException(`Linea con ID ${id} no encontrada`);
    }

    return linea;
  }

  async updateLinea(id: number, updateLineaDto: UpdateLineaDto) {
    await this.findOneLinea(id);

    try {
      return await this.prisma.linea.update({
        where: {
          lineaId: id,
        },
        data: {
          nombre: updateLineaDto.nombre,
          estadoRegistro: updateLineaDto.estadoRegistro,
        },
        include: {
          grupos: true,
        },
      });
    } catch (error) {
      this.handleDBError(error, 'Ya existe una linea con ese nombre');
    }
  }

  async changeLineaStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneLinea(id);

    try {
      return await this.prisma.linea.update({
        where: {
          lineaId: id,
        },
        data: {
          estadoRegistro: changeStatusDto.estadoRegistro,
        },
        include: {
          grupos: true,
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async createGrupo(createGrupoDto: CreateGrupoDto) {
    await this.findOneLinea(createGrupoDto.lineaId);

    try {
      return await this.prisma.grupo.create({
        data: {
          nombre: createGrupoDto.nombre,
          estadoRegistro: createGrupoDto.estadoRegistro,
          lineaId: createGrupoDto.lineaId,
        },
        include: {
          linea: true,
          productos: true,
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAllGrupos(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const where: Prisma.GrupoWhereInput = {};

    const [items, totalItems] = await Promise.all([
      this.prisma.grupo.findMany({
        where,
        include: {
          linea: true,
          productos: {
            include: {
              inventario: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.grupo.count({ where }),
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

  async findGruposByLinea(lineaId: number, query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const where: Prisma.GrupoWhereInput = {
      estadoRegistro: true,
      lineaId,
    };

    const [items, totalItems] = await Promise.all([
      this.prisma.grupo.findMany({
        where,
        include: {
          linea: true,
          productos: {
            include: {
              inventario: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.grupo.count({ where }),
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

  async findOneGrupo(id: number) {
    const grupo = await this.prisma.grupo.findUnique({
      where: {
        grupoId: id,
      },
      include: {
        linea: true,
        productos: {
          include: {
            inventario: true,
          },
        },
      },
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return grupo;
  }

  async updateGrupo(id: number, updateGrupoDto: UpdateGrupoDto) {
    await this.findOneGrupo(id);

    if (updateGrupoDto.lineaId) {
      await this.findOneLinea(updateGrupoDto.lineaId);
    }

    try {
      return await this.prisma.grupo.update({
        where: {
          grupoId: id,
        },
        data: {
          nombre: updateGrupoDto.nombre,
          estadoRegistro: updateGrupoDto.estadoRegistro,
          lineaId: updateGrupoDto.lineaId,
        },
        include: {
          linea: true,
          productos: {
            include: {
              inventario: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async changeGrupoStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneGrupo(id);

    try {
      return await this.prisma.grupo.update({
        where: {
          grupoId: id,
        },
        data: {
          estadoRegistro: changeStatusDto.estadoRegistro,
        },
        include: {
          linea: true,
          productos: {
            include: {
              inventario: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async createMarca(createMarcaDto: CreateMarcaDto) {
    try {
      return await this.prisma.marca.create({
        data: {
          nombre: createMarcaDto.nombre,
          estadoRegistro: createMarcaDto.estadoRegistro,
        },
        include: {
          productos: {
            include: {
              grupo: {
                include: {
                  linea: true,
                },
              },
              inventario: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDBError(error, 'Ya existe una marca con ese nombre');
    }
  }

  async findAllMarcas(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, totalItems] = await Promise.all([
      this.prisma.marca.findMany({
        include: {
          productos: {
            include: {
              grupo: {
                include: {
                  linea: true,
                },
              },
              inventario: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.marca.count(),
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

  async findOneMarca(id: number) {
    const marca = await this.prisma.marca.findUnique({
      where: {
        marcaId: id,
      },
      include: {
        productos: {
          include: {
            grupo: {
              include: {
                linea: true,
              },
            },
            inventario: true,
          },
        },
      },
    });

    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return marca;
  }

  async updateMarca(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.findOneMarca(id);

    try {
      return await this.prisma.marca.update({
        where: {
          marcaId: id,
        },
        data: {
          nombre: updateMarcaDto.nombre,
          estadoRegistro: updateMarcaDto.estadoRegistro,
        },
        include: {
          productos: {
            include: {
              grupo: {
                include: {
                  linea: true,
                },
              },
              inventario: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDBError(error, 'Ya existe una marca con ese nombre');
    }
  }

  async changeMarcaStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneMarca(id);

    try {
      return await this.prisma.marca.update({
        where: {
          marcaId: id,
        },
        data: {
          estadoRegistro: changeStatusDto.estadoRegistro,
        },
        include: {
          productos: {
            include: {
              grupo: {
                include: {
                  linea: true,
                },
              },
              inventario: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async createProducto(createProductoDto: CreateProductoDto) {
    const {
      cantidadActual,
      cantidadMinima,
      grupoId,
      marcaId,
      costoReferencial,
      ...productoData
    } = createProductoDto;

    await this.findOneGrupo(grupoId);
    await this.findOneMarca(marcaId);

    if (cantidadActual !== undefined && cantidadActual < 0) {
      throw new BadRequestException('La cantidad actual no puede ser negativa');
    }

    if (cantidadMinima !== undefined && cantidadMinima < 0) {
      throw new BadRequestException('La cantidad minima no puede ser negativa');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const productoCreado = await tx.producto.create({
          data: {
            ...productoData,
            grupoId,
            marcaId,
            costoUnitario: costoReferencial ?? 0,
            inventario: {
              create: {
                cantidadActual: cantidadActual ?? 0,
                cantidadMinima: cantidadMinima ?? 0,
              },
            },
          },
        });

        const codigo = this.buildProductoCode(productoCreado.productoId);

        const producto = await tx.producto.update({
          where: {
            productoId: productoCreado.productoId,
          },
          data: {
            codigo,
          },
          include: {
            grupo: {
              include: {
                linea: true,
              },
            },
            marca: true,
            inventario: true,
          },
        });

        return this.mapProductoResponse(producto);
      });
    } catch (error) {
      this.handleDBError(
        error,
        'Error de concurrencia al generar el codigo. Intente de nuevo.',
      );
    }
  }

  async findAllProductos(query: PaginationQueryDto) {
    const currentPage = query.page ?? 1;
    const itemsPerPage = query.limit ?? 10;
    const skip = (currentPage - 1) * itemsPerPage;

    const [productos, totalItems] = await Promise.all([
      this.prisma.producto.findMany({
        include: {
          grupo: {
            include: {
              linea: true,
            },
          },
          marca: true,
          inventario: true,
        },
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: itemsPerPage,
      }),
      this.prisma.producto.count(),
    ]);

    return {
      items: productos.map((producto) => this.mapProductoResponse(producto)),
      meta: {
        pagination: buildPaginationMeta({
          totalItems,
          itemCount: productos.length,
          itemsPerPage,
          currentPage,
        }),
      },
    };
  }

  async findOneProducto(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: {
        productoId: id,
      },
      include: {
        grupo: {
          include: {
            linea: true,
          },
        },
        marca: true,
        inventario: true,
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return this.mapProductoResponse(producto);
  }

  async updateProducto(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOneProducto(id);

    const {
      cantidadActual,
      cantidadMinima,
      costoReferencial,
      grupoId,
      marcaId,
      ...productoData
    } = updateProductoDto;

    if (grupoId && grupoId !== producto.grupo.grupoId) {
      await this.findOneGrupo(grupoId);
    }

    if (marcaId && marcaId !== producto.marca.marcaId) {
      await this.findOneMarca(marcaId);
    }

    if (cantidadActual !== undefined && cantidadActual < 0) {
      throw new BadRequestException('La cantidad actual no puede ser negativa');
    }

    if (cantidadMinima !== undefined && cantidadMinima < 0) {
      throw new BadRequestException('La cantidad minima no puede ser negativa');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.producto.update({
          where: {
            productoId: id,
          },
          data: {
            nombre: productoData.nombre,
            descripcion: productoData.descripcion,
            precioVenta: productoData.precioVenta,
            costoUnitario: costoReferencial,
            estadoRegistro: productoData.estadoRegistro,
            grupoId,
            marcaId,
          },
        });

        if (cantidadActual !== undefined || cantidadMinima !== undefined) {
          await tx.inventario.update({
            where: {
              productoId: id,
            },
            data: {
              cantidadActual,
              cantidadMinima,
            },
          });
        }

        const updatedProducto = await tx.producto.findUnique({
          where: {
            productoId: id,
          },
          include: {
            grupo: {
              include: {
                linea: true,
              },
            },
            marca: true,
            inventario: true,
          },
        });

        if (!updatedProducto) {
          throw new InternalServerErrorException(
            'No se pudo recuperar el producto actualizado',
          );
        }

        return this.mapProductoResponse(updatedProducto);
      });
    } catch (error) {
      this.handleDBError(error, 'Ya existe un producto con ese codigo');
    }
  }

  async changeProductoStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneProducto(id);

    try {
      const producto = await this.prisma.producto.update({
        where: {
          productoId: id,
        },
        data: {
          estadoRegistro: changeStatusDto.estadoRegistro,
        },
        include: {
          grupo: {
            include: {
              linea: true,
            },
          },
          marca: true,
          inventario: true,
        },
      });

      return this.mapProductoResponse(producto);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private buildProductoCode(productoId: number): string {
    return `SLO-${String(productoId).padStart(5, '0')}`;
  }

  private mapProductoResponse(
    producto: Prisma.ProductoGetPayload<{
      include: {
        grupo: {
          include: {
            linea: true;
          };
        };
        marca: true;
        inventario: true;
      };
    }>,
  ) {
    return {
      productoId: producto.productoId,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioVenta: Number(producto.precioVenta),
      costoReferencial: Number(producto.costoUnitario),
      estadoRegistro: producto.estadoRegistro,
      fechaCreacion: producto.fechaCreacion,
      fechaModificacion: producto.fechaActualizacion,
      grupo: {
        ...producto.grupo,
        fechaModificacion: producto.grupo.fechaActualizacion,
      },
      marca: {
        ...producto.marca,
        fechaModificacion: producto.marca.fechaActualizacion,
      },
      inventario: {
        ...producto.inventario!,
        fechaModificacion: producto.inventario!.fechaActualizacion,
      },
    };
  }

  private handleDBError(error: unknown, duplicateMessage?: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ConflictException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Registro no encontrado.');
      }

      if (error.code === 'P2002') {
        throw new ConflictException(
          duplicateMessage ??
            'Ya existe un registro con datos unicos duplicados.',
        );
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Error de llave foranea en la base de datos.',
        );
      }
    }

    throw new InternalServerErrorException('Database error');
  }
}
