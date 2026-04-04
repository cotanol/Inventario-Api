import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import {
  UpdateCompraDto,
  ConfirmarOrdenDto,
  RecibirMercaderiaDto,
} from './dto/update-compra.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @ApiStandardItemResponse('Compra creada correctamente', 'created', {
    dataExample: swaggerExamples.compra,
  })
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de compras', swaggerExamples.compra)
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.comprasService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiStandardItemResponse('Compra obtenida correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }

  @Patch(':id')
  @ApiStandardItemResponse('Compra actualizada correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompraDto: UpdateCompraDto,
  ) {
    return this.comprasService.update(id, updateCompraDto);
  }

  @Delete(':id')
  @ApiStandardItemResponse('Compra eliminada correctamente', 'ok', {
    dataExample: swaggerExamples.statusMessage,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.remove(id);
  }

  // ============================================================
  // ENDPOINTS DE TRANSICIÓN DE ESTADO
  // ============================================================

  @Patch(':id/confirmar')
  @ApiStandardItemResponse('Compra confirmada correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  confirmarOrden(
    @Param('id', ParseIntPipe) id: number,
    @Body() confirmarOrdenDto: ConfirmarOrdenDto,
  ) {
    return this.comprasService.confirmarOrden(id, confirmarOrdenDto);
  }

  @Patch(':id/transito')
  @ApiStandardItemResponse('Compra marcada en transito correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  marcarEnTransito(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { fechaLlegadaEstimada?: string },
  ) {
    return this.comprasService.marcarEnTransito(id, body.fechaLlegadaEstimada);
  }

  @Patch(':id/recepcion')
  @ApiStandardItemResponse('Mercaderia recibida correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  recibirMercaderia(
    @Param('id', ParseIntPipe) id: number,
    @Body() recibirMercaderiaDto: RecibirMercaderiaDto,
  ) {
    return this.comprasService.recibirMercaderia(id, recibirMercaderiaDto);
  }

  @Patch(':id/cancelar')
  @ApiStandardItemResponse('Compra cancelada correctamente', 'ok', {
    dataExample: swaggerExamples.compra,
  })
  cancelarCompra(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.cancelarCompra(id);
  }
}
