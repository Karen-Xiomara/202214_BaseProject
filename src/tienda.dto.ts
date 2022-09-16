import { IsNotEmpty, IsString } from 'class-validator';

export class TiendaDto {
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly ciudad: string;

  @IsNotEmpty()
  @IsString()
  readonly direccion: string;
}
