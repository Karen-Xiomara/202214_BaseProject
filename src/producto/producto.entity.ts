import { TiendaEntity } from "../tienda/tienda.entity";
import { PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, Entity } from "typeorm";

@Entity()
export class ProductoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    precio: string;

    @Column()
    tipo: string;

    @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    @JoinTable()
    tiendas: TiendaEntity[];
}