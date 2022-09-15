import { ProductoEntity } from "../producto/producto.entity";
import { PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, Entity } from "typeorm";

@Entity()
export class TiendaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    ciudad: string;

    @Column()
    direccion: string;
    
    @ManyToMany(() => ProductoEntity, producto => producto.tiendas)
    productos: ProductoEntity[];
}
