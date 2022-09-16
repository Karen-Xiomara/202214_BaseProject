import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendaService],
  controllers: [TiendaController]
})
export class TiendaModule {}
