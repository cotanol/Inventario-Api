import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['clave', 'rolId'] as const),
) {
  @ApiProperty({
    description: 'ID del rol a asignar. Si se envía, reemplaza el rol actual.',
    example: 1,
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  rolId?: number;
}
