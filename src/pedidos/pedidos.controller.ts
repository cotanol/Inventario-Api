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
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto, ChangeEstadoPedidoDto, UpdatePedidoDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';
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
  @RequirePermissions(ValidPermissions.CREAR_PEDIDO)
  @ApiStandardItemResponse('Pedido creado correctamente', 'created', {
    dataExample: swaggerExamples.pedido,
  })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @RequirePermissions(ValidPermissions.VER_PEDIDOS)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse('Lista paginada de pedidos', swaggerExamples.pedido)
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.pedidosService.findAll(paginationQuery);
  }

  @Get(':id')
  @RequirePermissions(ValidPermissions.VER_PEDIDOS)
  @ApiStandardItemResponse('Pedido obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(ValidPermissions.EDITAR_PEDIDO)
  @ApiStandardItemResponse('Pedido actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Patch(':id/change-estado')
  @RequirePermissions(ValidPermissions.EDITAR_PEDIDO)
  @ApiStandardItemResponse('Estado de pedido actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.pedido,
  })
  changeEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeEstadoDto: ChangeEstadoPedidoDto,
  ) {
    return this.pedidosService.changeEstado(id, changeEstadoDto);
  }
}
