import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PermisoModulo } from 'generated/prisma/client';
import { CatalogoService } from './catalogo.service';
import {
  CreateLineaDto,
  UpdateLineaDto,
  CreateGrupoDto,
  UpdateGrupoDto,
  CreateMarcaDto,
  UpdateMarcaDto,
  CreateProductoDto,
  UpdateProductoDto,
} from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  // === ENDPOINTS LÍNEAS ===
  @Post('lineas')
  @RequirePermissions(PermisoModulo.LINEAS)
  @ApiStandardItemResponse('Linea creada correctamente', 'created', {
    dataExample: swaggerExamples.linea,
  })
  createLinea(@Body() createLineaDto: CreateLineaDto) {
    return this.catalogoService.createLinea(createLineaDto);
  }

  @Get('lineas')
  @RequirePermissions(PermisoModulo.LINEAS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de lineas', swaggerExamples.linea)
  findAllLineas(@Query() paginationQuery: PaginationQueryDto) {
    return this.catalogoService.findAllLineas(paginationQuery);
  }

  @Get('lineas/:id')
  @RequirePermissions(PermisoModulo.LINEAS)
  @ApiStandardItemResponse('Linea obtenida correctamente', 'ok', {
    dataExample: swaggerExamples.linea,
  })
  findOneLinea(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneLinea(id);
  }

  @Patch('lineas/:id')
  @RequirePermissions(PermisoModulo.LINEAS)
  @ApiStandardItemResponse('Linea actualizada correctamente', 'ok', {
    dataExample: swaggerExamples.linea,
  })
  updateLinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLineaDto: UpdateLineaDto,
  ) {
    return this.catalogoService.updateLinea(id, updateLineaDto);
  }

  @Patch('lineas/:id/change-status')
  @RequirePermissions(PermisoModulo.LINEAS)
  @ApiStandardItemResponse('Estado de linea actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.linea,
  })
  changeLineaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeLineaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS GRUPOS ===
  @Post('grupos')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiStandardItemResponse('Grupo creado correctamente', 'created', {
    dataExample: swaggerExamples.grupo,
  })
  createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
    return this.catalogoService.createGrupo(createGrupoDto);
  }

  @Get('grupos')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de grupos', swaggerExamples.grupo)
  findAllGrupos(@Query() paginationQuery: PaginationQueryDto) {
    return this.catalogoService.findAllGrupos(paginationQuery);
  }

  @Get('grupos/linea/:lineaId')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de grupos por linea',
    swaggerExamples.grupo,
  )
  findGruposByLinea(
    @Param('lineaId', ParseIntPipe) lineaId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.catalogoService.findGruposByLinea(lineaId, paginationQuery);
  }

  @Get('grupos/:id')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiStandardItemResponse('Grupo obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.grupo,
  })
  findOneGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneGrupo(id);
  }

  @Patch('grupos/:id')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiStandardItemResponse('Grupo actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.grupo,
  })
  updateGrupo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ) {
    return this.catalogoService.updateGrupo(id, updateGrupoDto);
  }

  @Patch('grupos/:id/change-status')
  @RequirePermissions(PermisoModulo.GRUPOS)
  @ApiStandardItemResponse('Estado de grupo actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.grupo,
  })
  changeGrupoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeGrupoStatus(id, changeStatusDto);
  }

  // === ENDPOINTS MARCAS ===
  @Post('marcas')
  @RequirePermissions(PermisoModulo.MARCAS)
  @ApiStandardItemResponse('Marca creada correctamente', 'created', {
    dataExample: swaggerExamples.marca,
  })
  createMarca(@Body() createMarcaDto: CreateMarcaDto) {
    return this.catalogoService.createMarca(createMarcaDto);
  }

  @Get('marcas')
  @RequirePermissions(PermisoModulo.MARCAS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de marcas', swaggerExamples.marca)
  findAllMarcas(@Query() paginationQuery: PaginationQueryDto) {
    return this.catalogoService.findAllMarcas(paginationQuery);
  }

  @Get('marcas/:id')
  @RequirePermissions(PermisoModulo.MARCAS)
  @ApiStandardItemResponse('Marca obtenida correctamente', 'ok', {
    dataExample: swaggerExamples.marca,
  })
  findOneMarca(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneMarca(id);
  }

  @Patch('marcas/:id')
  @RequirePermissions(PermisoModulo.MARCAS)
  @ApiStandardItemResponse('Marca actualizada correctamente', 'ok', {
    dataExample: swaggerExamples.marca,
  })
  updateMarca(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.catalogoService.updateMarca(id, updateMarcaDto);
  }

  @Patch('marcas/:id/change-status')
  @RequirePermissions(PermisoModulo.MARCAS)
  @ApiStandardItemResponse('Estado de marca actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.marca,
  })
  changeMarcaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeMarcaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS PRODUCTOS ===
  @Post('productos')
  @RequirePermissions(PermisoModulo.PRODUCTOS)
  @ApiStandardItemResponse('Producto creado correctamente', 'created', {
    dataExample: swaggerExamples.producto,
  })
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.catalogoService.createProducto(createProductoDto);
  }

  @Get('productos')
  @RequirePermissions(PermisoModulo.PRODUCTOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de productos',
    swaggerExamples.producto,
  )
  findAllProductos(@Query() paginationQuery: PaginationQueryDto) {
    return this.catalogoService.findAllProductos(paginationQuery);
  }

  @Get('productos/:id')
  @RequirePermissions(PermisoModulo.PRODUCTOS)
  @ApiStandardItemResponse('Producto obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.producto,
  })
  findOneProducto(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneProducto(id);
  }

  @Patch('productos/:id')
  @RequirePermissions(PermisoModulo.PRODUCTOS)
  @ApiStandardItemResponse('Producto actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.producto,
  })
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.catalogoService.updateProducto(id, updateProductoDto);
  }

  @Patch('productos/:id/change-status')
  @RequirePermissions(PermisoModulo.PRODUCTOS)
  @ApiStandardItemResponse(
    'Estado de producto actualizado correctamente',
    'ok',
    {
      dataExample: swaggerExamples.producto,
    },
  )
  changeProductoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeProductoStatus(id, changeStatusDto);
  }
}
