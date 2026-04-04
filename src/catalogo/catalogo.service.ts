import {
  BadRequestException,
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
  constructor(private readonly prisma: PrismaService) { }

  async createLinea(createLineaDto: CreateLineaDto) {
    return this.prisma.linea.create({
      data: {
        nombre: createLineaDto.nombre,
        estadoRegistro: createLineaDto.estadoRegistro,
      },
      include: {
        grupos: true,
      },
    });
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

    return this.prisma.linea.update({
      where: {
        lineaId: id,
      },
      data: updateLineaDto,
      include: {
        grupos: true,
      },
    });
  }

  async changeLineaStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneLinea(id);

    return this.prisma.linea.update({
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
  }

  async createGrupo(createGrupoDto: CreateGrupoDto) {
    await this.findOneLinea(createGrupoDto.lineaId);

    return this.prisma.grupo.create({
      data: createGrupoDto,
      include: {
        linea: true,
        productos: true,
      },
    });
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

    return this.prisma.grupo.update({
      where: {
        grupoId: id,
      },
      data: updateGrupoDto,
      include: {
        linea: true,
        productos: {
          include: {
            inventario: true,
          },
        },
      },
    });
  }

  async changeGrupoStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneGrupo(id);

    return this.prisma.grupo.update({
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
  }

  async createMarca(createMarcaDto: CreateMarcaDto) {
    return this.prisma.marca.create({
      data: createMarcaDto,
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

    return this.prisma.marca.update({
      where: {
        marcaId: id,
      },
      data: updateMarcaDto,
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
  }

  async changeMarcaStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneMarca(id);

    return this.prisma.marca.update({
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

    return this.prisma.$transaction(async (tx) => {
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

    return this.prisma.$transaction(async (tx) => {
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
  }

  async changeProductoStatus(id: number, changeStatusDto: ChangeStatusDto) {
    await this.findOneProducto(id);

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
}
