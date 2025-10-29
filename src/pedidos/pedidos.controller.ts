import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto, ChangeEstadoPedidoDto, UpdatePedidoDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  // TODO: Agregar el permiso cuando se cree en el seed
  // @RequirePermissions(ValidPermissions.CREAR_PEDIDO)
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  // TODO: Agregar el permiso cuando se cree en el seed
  // @RequirePermissions(ValidPermissions.VER_PEDIDOS)
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  // TODO: Agregar el permiso cuando se cree en el seed
  // @RequirePermissions(ValidPermissions.VER_PEDIDOS)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  // TODO: Agregar el permiso cuando se cree en el seed
  // @RequirePermissions(ValidPermissions.EDITAR_PEDIDO)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Patch(':id/change-estado')
  // TODO: Agregar el permiso cuando se cree en el seed
  // @RequirePermissions(ValidPermissions.EDITAR_PEDIDO)
  changeEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeEstadoDto: ChangeEstadoPedidoDto,
  ) {
    return this.pedidosService.changeEstado(id, changeEstadoDto);
  }
}
