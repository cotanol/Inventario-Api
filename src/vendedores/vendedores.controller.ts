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
import { ChangeStatusDto } from 'src/common/dto/change-status.dto';
import { VendedoresService } from './vendedores.service';
import { CreateVendedorDto, UpdateVendedorDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  @RequirePermissions(PermisoModulo.VENDEDORES)
  @ApiStandardItemResponse('Vendedor creado correctamente', 'created', {
    dataExample: swaggerExamples.vendedor,
  })
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedoresService.create(createVendedorDto);
  }

  @Get()
  @RequirePermissions(PermisoModulo.VENDEDORES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de vendedores',
    swaggerExamples.vendedor,
  )
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.vendedoresService.findAll(paginationQuery);
  }

  @Get(':id')
  @RequirePermissions(PermisoModulo.VENDEDORES)
  @ApiStandardItemResponse('Vendedor obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.vendedor,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendedoresService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermisoModulo.VENDEDORES)
  @ApiStandardItemResponse('Vendedor actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.vendedor,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ) {
    return this.vendedoresService.update(id, updateVendedorDto);
  }

  @Patch(':id/change-status')
  @RequirePermissions(PermisoModulo.VENDEDORES)
  @ApiStandardItemResponse(
    'Estado de vendedor actualizado correctamente',
    'ok',
    {
      dataExample: swaggerExamples.statusMessage,
    },
  )
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.vendedoresService.changeStatus(id, changeStatusDto);
  }
}
