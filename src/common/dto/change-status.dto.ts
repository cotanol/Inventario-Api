import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeStatusDto {
  @IsNotEmpty({ message: 'El campo estadoRegistro no puede estar vacio.' })
  @IsBoolean({
    message:
      'El campo estadoRegistro debe ser un valor booleano (true o false).',
  })
  estadoRegistro!: boolean;
}
