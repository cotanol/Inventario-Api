import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { CreateVendedorDto, UpdateVendedorDto, ChangeStatusDto } from './dto';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  @RequirePermissions(ValidPermissions.CREAR_VENDEDOR)
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedoresService.create(createVendedorDto);
  }

  @Get()
  @RequirePermissions(ValidPermissions.VER_VENDEDORES)
  findAll() {
    return this.vendedoresService.findAll();
  }

  @Get(':id')
  @RequirePermissions(ValidPermissions.VER_VENDEDORES)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendedoresService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(ValidPermissions.EDITAR_VENDEDOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ) {
    return this.vendedoresService.update(id, updateVendedorDto);
  }

  @Patch(':id/change-status')
  @RequirePermissions(ValidPermissions.EDITAR_VENDEDOR)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.vendedoresService.changeStatus(id, changeStatusDto);
  }
}
