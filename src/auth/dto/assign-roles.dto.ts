import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
  @ApiProperty({
    description:
      'Array de IDs de los perfiles a asignar. Si se envía vacío, se quitarán todos los roles.',
    example: ['uuid-del-perfil-tecnico'],
  })
  @IsArray()
  @IsUUID('4', { each: true }) // Valida que cada elemento del array sea un UUID v4
  @ArrayMinSize(1)
  perfilesIds: string[];
}
