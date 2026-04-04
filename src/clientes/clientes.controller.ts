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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @RequirePermissions(ValidPermissions.CREAR_CLIENTE)
  @ApiStandardItemResponse('Cliente creado correctamente', 'created', {
    dataExample: swaggerExamples.cliente,
  })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @RequirePermissions(ValidPermissions.VER_CLIENTES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de clientes',
    swaggerExamples.cliente,
  )
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.clientesService.findAll(paginationQuery);
  }

  @Get(':id')
  @RequirePermissions(ValidPermissions.VER_CLIENTES)
  @ApiStandardItemResponse('Cliente obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.cliente,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(ValidPermissions.EDITAR_CLIENTE)
  @ApiStandardItemResponse('Cliente actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.cliente,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Patch(':id/change-status')
  @RequirePermissions(ValidPermissions.ELIMINAR_CLIENTE)
  @ApiStandardItemResponse(
    'Estado de cliente actualizado correctamente',
    'ok',
    {
      dataExample: swaggerExamples.cliente,
    },
  )
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.clientesService.changeStatus(id, changeStatusDto);
  }
}
