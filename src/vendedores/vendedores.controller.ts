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
import { VendedoresService } from './vendedores.service';
import { CreateVendedorDto, UpdateVendedorDto, ChangeStatusDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';
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
  @RequirePermissions(ValidPermissions.CREAR_VENDEDOR)
  @ApiStandardItemResponse('Vendedor creado correctamente', 'created', {
    dataExample: swaggerExamples.vendedor,
  })
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedoresService.create(createVendedorDto);
  }

  @Get()
  @RequirePermissions(ValidPermissions.VER_VENDEDORES)
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de vendedores',
    swaggerExamples.vendedor,
  )
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.vendedoresService.findAll(paginationQuery);
  }

  @Get(':id')
  @RequirePermissions(ValidPermissions.VER_VENDEDORES)
  @ApiStandardItemResponse('Vendedor obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.vendedor,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendedoresService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(ValidPermissions.EDITAR_VENDEDOR)
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
  @RequirePermissions(ValidPermissions.EDITAR_VENDEDOR)
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
