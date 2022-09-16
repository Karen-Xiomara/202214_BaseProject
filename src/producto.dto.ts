import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ProductoDto {
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly precio: string;

  @IsNotEmpty()
  @IsString()
  readonly tipo: string;
}
