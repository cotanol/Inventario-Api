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
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiStandardItemResponse('Pedido creado correctamente', 'created', {
    dataExample: swaggerExamples.pedido,
  })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de pedidos', swaggerExamples.pedido)
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.pedidosService.findAll(paginationQuery);
  }

  @Get(':id')
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiStandardItemResponse('Pedido obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiStandardItemResponse('Pedido actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Patch(':id/completar')
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiStandardItemResponse('Pedido completado correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  completarPedido(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.completarPedido(id);
  }

  @Patch(':id/cancelar')
  @RequirePermissions(PermisoModulo.PEDIDOS)
  @ApiStandardItemResponse('Pedido cancelado correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  cancelarPedido(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.cancelarPedido(id);
  }
}
