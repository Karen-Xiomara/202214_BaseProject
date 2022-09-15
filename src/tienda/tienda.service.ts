import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError, } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly TiendaRepository: Repository<TiendaEntity>,
    ) { }

    async findAll(): Promise<TiendaEntity[]> {
        return await this.TiendaRepository.find({ relations: ['productos'], });
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.TiendaRepository.findOne({
            where: { id },
            relations: ['productos'],
        });

        if (!tienda) {
            throw new BusinessLogicException('La tienda no fue encontrada', BusinessError.NOT_FOUND);
        }

        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        
        if (tienda.ciudad.length != 3){
            throw new BusinessLogicException('La ciudad debe ser un codigo de 3 caracteres', BusinessError.PRECONDITION_FAILED);
        }

        return await this.TiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const persistedTienda: TiendaEntity = await this.TiendaRepository.findOne({ where: { id } });

        if (!persistedTienda) {
            throw new BusinessLogicException('La tienda no fue encontrada', BusinessError.NOT_FOUND);
        }

        tienda.id = id;
        
        return await this.TiendaRepository.save(tienda);
    }

    async delete(id: string) {
        const tienda: TiendaEntity = await this.TiendaRepository.findOne({ where: { id } });

        if (!tienda) {
            throw new BusinessLogicException('La tienda no fue encontrada', BusinessError.NOT_FOUND);
        }

        await this.TiendaRepository.remove(tienda);
    }
}