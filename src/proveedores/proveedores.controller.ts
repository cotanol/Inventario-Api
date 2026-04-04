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
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiPaginationQueryDocs,
  ApiStandardItemResponse,
  ApiStandardListResponse,
} from 'src/common/swagger/api-standard-response.decorator';
import { swaggerExamples } from 'src/common/swagger/examples';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @ApiStandardItemResponse('Proveedor creado correctamente', 'created', {
    dataExample: swaggerExamples.proveedor,
  })
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Get()
  @ApiPaginationQueryDocs()
  @ApiStandardListResponse(
    'Lista paginada de proveedores',
    swaggerExamples.proveedor,
  )
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.proveedoresService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiStandardItemResponse('Proveedor obtenido correctamente', 'ok', {
    dataExample: swaggerExamples.proveedor,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id')
  @ApiStandardItemResponse('Proveedor actualizado correctamente', 'ok', {
    dataExample: swaggerExamples.proveedor,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @ApiStandardItemResponse('Proveedor eliminado correctamente', 'ok', {
    dataExample: swaggerExamples.statusMessage,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.remove(id);
  }
}
