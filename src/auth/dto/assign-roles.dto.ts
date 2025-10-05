import { ArrayMinSize, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AssignRolesDto {
  @ApiProperty({
    description:
      'Array de IDs de los perfiles a asignar. Si se envía vacío, se quitarán todos los roles.',
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @ArrayMinSize(1)
  perfilesIds: number[];
}
