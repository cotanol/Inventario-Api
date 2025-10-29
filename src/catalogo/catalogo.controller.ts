import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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
  ChangeStatusDto,
} from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  // === ENDPOINTS LÍNEAS ===
  @Post('lineas')
  @RequirePermissions(ValidPermissions.CREAR_LINEA)
  createLinea(@Body() createLineaDto: CreateLineaDto) {
    return this.catalogoService.createLinea(createLineaDto);
  }

  @Get('lineas')
  @RequirePermissions(ValidPermissions.VER_LINEAS)
  findAllLineas() {
    return this.catalogoService.findAllLineas();
  }

  @Get('lineas/:id')
  @RequirePermissions(ValidPermissions.VER_LINEAS)
  findOneLinea(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneLinea(id);
  }

  @Patch('lineas/:id')
  @RequirePermissions(ValidPermissions.EDITAR_LINEA)
  updateLinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLineaDto: UpdateLineaDto,
  ) {
    return this.catalogoService.updateLinea(id, updateLineaDto);
  }

  @Patch('lineas/:id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_LINEA)
  changeLineaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeLineaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS GRUPOS ===
  @Post('grupos')
  @RequirePermissions(ValidPermissions.CREAR_GRUPO)
  createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
    return this.catalogoService.createGrupo(createGrupoDto);
  }

  @Get('grupos')
  @RequirePermissions(ValidPermissions.VER_GRUPOS)
  findAllGrupos() {
    return this.catalogoService.findAllGrupos();
  }

  @Get('grupos/linea/:lineaId')
  @RequirePermissions(ValidPermissions.VER_GRUPOS)
  findGruposByLinea(@Param('lineaId', ParseIntPipe) lineaId: number) {
    return this.catalogoService.findGruposByLinea(lineaId);
  }

  @Get('grupos/:id')
  @RequirePermissions(ValidPermissions.VER_GRUPOS)
  findOneGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneGrupo(id);
  }

  @Patch('grupos/:id')
  @RequirePermissions(ValidPermissions.EDITAR_GRUPO)
  updateGrupo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ) {
    return this.catalogoService.updateGrupo(id, updateGrupoDto);
  }

  @Patch('grupos/:id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_GRUPO)
  changeGrupoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeGrupoStatus(id, changeStatusDto);
  }

  // === ENDPOINTS MARCAS ===
  @Post('marcas')
  @RequirePermissions(ValidPermissions.CREAR_MARCA)
  createMarca(@Body() createMarcaDto: CreateMarcaDto) {
    return this.catalogoService.createMarca(createMarcaDto);
  }

  @Get('marcas')
  @RequirePermissions(ValidPermissions.VER_MARCAS)
  findAllMarcas() {
    return this.catalogoService.findAllMarcas();
  }

  @Get('marcas/:id')
  @RequirePermissions(ValidPermissions.VER_MARCAS)
  findOneMarca(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneMarca(id);
  }

  @Patch('marcas/:id')
  @RequirePermissions(ValidPermissions.EDITAR_MARCA)
  updateMarca(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.catalogoService.updateMarca(id, updateMarcaDto);
  }

  @Patch('marcas/:id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_MARCA)
  changeMarcaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeMarcaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS PRODUCTOS ===
  @Post('productos')
  @RequirePermissions(ValidPermissions.CREAR_PRODUCTO)
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.catalogoService.createProducto(createProductoDto);
  }

  @Get('productos')
  @RequirePermissions(ValidPermissions.VER_PRODUCTOS)
  findAllProductos() {
    return this.catalogoService.findAllProductos();
  }

  @Get('productos/:id')
  @RequirePermissions(ValidPermissions.VER_PRODUCTOS)
  findOneProducto(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneProducto(id);
  }

  @Patch('productos/:id')
  @RequirePermissions(ValidPermissions.EDITAR_PRODUCTO)
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.catalogoService.updateProducto(id, updateProductoDto);
  }

  @Patch('productos/:id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_PRODUCTO)
  changeProductoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeProductoStatus(id, changeStatusDto);
  }
}
