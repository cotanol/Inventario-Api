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

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  // === ENDPOINTS LÍNEAS ===
  @Post('lineas')
  createLinea(@Body() createLineaDto: CreateLineaDto) {
    return this.catalogoService.createLinea(createLineaDto);
  }

  @Get('lineas')
  findAllLineas() {
    return this.catalogoService.findAllLineas();
  }

  @Get('lineas/:id')
  findOneLinea(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneLinea(id);
  }

  @Patch('lineas/:id')
  updateLinea(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLineaDto: UpdateLineaDto,
  ) {
    return this.catalogoService.updateLinea(id, updateLineaDto);
  }

  @Patch('lineas/:id/change-status')
  changeLineaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeLineaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS GRUPOS ===
  @Post('grupos')
  createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
    return this.catalogoService.createGrupo(createGrupoDto);
  }

  @Get('grupos')
  findAllGrupos() {
    return this.catalogoService.findAllGrupos();
  }

  @Get('grupos/linea/:lineaId')
  findGruposByLinea(@Param('lineaId', ParseIntPipe) lineaId: number) {
    return this.catalogoService.findGruposByLinea(lineaId);
  }

  @Get('grupos/:id')
  findOneGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneGrupo(id);
  }

  @Patch('grupos/:id')
  updateGrupo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ) {
    return this.catalogoService.updateGrupo(id, updateGrupoDto);
  }

  @Patch('grupos/:id/change-status')
  changeGrupoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeGrupoStatus(id, changeStatusDto);
  }

  // === ENDPOINTS MARCAS ===
  @Post('marcas')
  createMarca(@Body() createMarcaDto: CreateMarcaDto) {
    return this.catalogoService.createMarca(createMarcaDto);
  }

  @Get('marcas')
  findAllMarcas() {
    return this.catalogoService.findAllMarcas();
  }

  @Get('marcas/:id')
  findOneMarca(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneMarca(id);
  }

  @Patch('marcas/:id')
  updateMarca(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.catalogoService.updateMarca(id, updateMarcaDto);
  }

  @Patch('marcas/:id/change-status')
  changeMarcaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeMarcaStatus(id, changeStatusDto);
  }

  // === ENDPOINTS PRODUCTOS ===
  @Post('productos')
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.catalogoService.createProducto(createProductoDto);
  }

  @Get('productos')
  findAllProductos() {
    return this.catalogoService.findAllProductos();
  }

  @Get('productos/:id')
  findOneProducto(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoService.findOneProducto(id);
  }

  @Patch('productos/:id')
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.catalogoService.updateProducto(id, updateProductoDto);
  }

  @Patch('productos/:id/change-status')
  changeProductoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.catalogoService.changeProductoStatus(id, changeStatusDto);
  }
}
