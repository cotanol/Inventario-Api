import { IsBoolean } from 'class-validator';

export class ChangeStatusDto {
  @IsBoolean()
  estadoRegistro!: boolean;
}
