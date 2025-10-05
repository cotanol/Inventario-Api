import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsOptional, IsInt, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['clave', 'perfilesIds'] as const),
) {
  @ApiProperty({
    description:
      'Array de IDs de los perfiles a asignar. Si se envía, debe contener al menos un perfil.',
    example: [1, 2],
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @ArrayMinSize(1)
  @IsOptional()
  perfilesIds?: number[];
}
