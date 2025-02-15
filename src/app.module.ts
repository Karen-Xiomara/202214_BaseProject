import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoEntity } from './producto/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ProductoModule, TiendaModule, ProductoTiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'store',
      entities: [TiendaEntity,  ProductoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
