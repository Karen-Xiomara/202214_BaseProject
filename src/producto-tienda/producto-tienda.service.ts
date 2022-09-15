import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoTiendaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) { }

    async addStoreToProduct(productoId: string, tiendaId: string): Promise<ProductoEntity> {

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ["tiendas"] })
        if (!producto)
            throw new BusinessLogicException("El producto no fue encontrado", BusinessError.NOT_FOUND)

        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!tienda)
            throw new BusinessLogicException("La tienda no fue encontrada", BusinessError.NOT_FOUND)

        producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
    }

    async findStoreFromProduct(productoId: string, tiendaId: string): Promise<TiendaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ["tiendas"] });
        if (!producto)
            throw new BusinessLogicException("El producto no fue encontrado", BusinessError.NOT_FOUND)

        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!tienda)
            throw new BusinessLogicException("La tienda no fue encontrada", BusinessError.NOT_FOUND)
     

        const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);

        if (!productoTienda)
            throw new BusinessLogicException("La tienda no esta asociada a el producto", BusinessError.PRECONDITION_FAILED)

        return productoTienda;
    }

    async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ["tiendas"] });
        if (!producto)
            throw new BusinessLogicException("El producto no fue encontrado", BusinessError.NOT_FOUND)

        return producto.tiendas;
    }

    async updateStoresFromProduct(productoId: string, tiendas: TiendaEntity[]): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ["tiendas"] });

        if (!producto)
            throw new BusinessLogicException("El producto no fue encontrado", BusinessError.NOT_FOUND)

        for (let i = 0; i < tiendas.length; i++) {
            const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: `${tiendas[i].id}` } });
            if (!tienda)
                throw new BusinessLogicException("La tienda no fue encontrada", BusinessError.NOT_FOUND)
        }

        producto.tiendas = tiendas;
        return await this.productoRepository.save(producto);
    }

    async deleteStoreFromProduct(productoId: string, tiendaId: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
        if (!tienda)
            throw new BusinessLogicException("La tienda no fue encontrada", BusinessError.NOT_FOUND)

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, relations: ["tiendas"] });
        if (!producto)
            throw new BusinessLogicException("El producto no fue encontrado", BusinessError.NOT_FOUND)

        const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);

        if (!productoTienda)
            throw new BusinessLogicException("La tienda no esta asociada a el producto", BusinessError.PRECONDITION_FAILED)

        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);
        await this.productoRepository.save(producto);
    }
}