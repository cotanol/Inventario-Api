import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import {
  UpdateCompraDto,
  ConfirmarOrdenDto,
  RecibirMercaderiaDto,
} from './dto/update-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  findAll() {
    return this.comprasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto) {
    return this.comprasService.update(+id, updateCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comprasService.remove(+id);
  }

  // ============================================================
  // ENDPOINTS DE TRANSICIÓN DE ESTADO
  // ============================================================

  @Patch(':id/confirmar')
  confirmarOrden(
    @Param('id') id: string,
    @Body() confirmarOrdenDto: ConfirmarOrdenDto,
  ) {
    return this.comprasService.confirmarOrden(+id, confirmarOrdenDto);
  }

  @Patch(':id/transito')
  marcarEnTransito(
    @Param('id') id: string,
    @Body() body: { fechaLlegadaEstimada?: string },
  ) {
    return this.comprasService.marcarEnTransito(+id, body.fechaLlegadaEstimada);
  }

  @Patch(':id/recepcion')
  recibirMercaderia(
    @Param('id') id: string,
    @Body() recibirMercaderiaDto: RecibirMercaderiaDto,
  ) {
    return this.comprasService.recibirMercaderia(+id, recibirMercaderiaDto);
  }

  @Patch(':id/cancelar')
  cancelarCompra(@Param('id') id: string) {
    return this.comprasService.cancelarCompra(+id);
  }
}
