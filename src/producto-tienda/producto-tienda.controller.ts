import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TiendaDto } from 'src/tienda.dto';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoTiendaService } from './producto-tienda.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}
 
    @Post(':productoId/stores/:tiendaId')
    async addTiendaProducto(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
    }
 
    @Get(':productoId/stores/:tiendaId')
    async findTiendaByProductoIdTiendaId(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.findStoreFromProduct(productoId, tiendaId);
    }
 
    @Get(':productoId/stores')
    async findTiendasByProductoId(@Param('productoId') productoId: string){
        return await this.productoTiendaService.findStoresFromProduct(productoId);
    }
 
    @Put(':productoId/stores')
    async associateTiendasProducto(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string){
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.productoTiendaService.updateStoresFromProduct(productoId, tiendas);
    }
    
    @Delete(':productoId/stores/:tiendaId')
    @HttpCode(204)
    async deleteTiendaProducto(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.deleteStoreFromProduct(productoId, tiendaId);
    }
 }