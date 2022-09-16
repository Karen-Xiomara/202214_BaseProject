import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ProductoDto } from 'src/producto.dto';

import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
    constructor(private readonly productoService: ProductoService) { }

    @Get()
    async findAll() {
        return await this.productoService.findAll();
    }

    @Get(':productoId')
    async findOne(@Param('productoId') productoId: string) {
        return await this.productoService.findOne(productoId);
    }

    @Post()
    async create(@Body() productoDto: ProductoDto) {
        const producto: ProductoEntity = plainToClass(ProductoEntity, productoDto);
        return await this.productoService.create(producto);
    }

    @Put(':productoId')
    async update(
        @Param('productoId') productoId: string,
        @Body() productoDto: ProductoDto,
    ) {
        const producto: ProductoEntity = plainToClass(ProductoEntity, productoDto);
        return await this.productoService.update(productoId, producto);
    }

    @Delete(':productoId')
    @HttpCode(204)
    async delete(@Param('productoId') productoId: string) {
        return await this.productoService.delete(productoId);
    }
}