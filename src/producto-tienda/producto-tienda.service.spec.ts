import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { ProductoTiendaService } from './producto-tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let tiendasList: TiendaEntity[];
  let producto: ProductoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();

    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.cityName().substring(0, 3),
        direccion: faker.address.direction(),
      })
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.commerce.price(1000, 2000, 0),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      tiendas: tiendasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an store to a product', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.commerce.price(1000, 2000, 0),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero'])
    })

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    })

    const result: ProductoEntity = await service.addStoreToProduct(newProducto.id, newTienda.id);

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad)
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion)
  });

  it('addStoreProduct should thrown exception for an invalid store', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.commerce.price(1000, 2000, 0),
      tipo: faker.helpers.arrayElement(['Perecedero', 'No perecedero'])
    })

    await expect(() => service.addStoreToProduct(newProducto.id, "0")).rejects.toHaveProperty("message", "La tienda no fue encontrada");
  });

  it('addStoreProduct should throw an exception for an invalid product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    })

    await expect(() => service.addStoreToProduct("0", newTienda.id)).rejects.toHaveProperty("message", "El producto no fue encontrado");
  });

  it('findStoreFromProduct should return producto by cultura', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedProducto: TiendaEntity = await service.findStoreFromProduct(producto.id, tienda.id)
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(tienda.nombre);
    expect(storedProducto.ciudad).toBe(tienda.ciudad);
    expect(storedProducto.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(() => service.findStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "La tienda no fue encontrada");
  });




  it('findStoreFromProduct should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() => service.findStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto no fue encontrado");
  });

  it('findStoreFromProduct should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    });

    await expect(() => service.findStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda no esta asociada a el producto");
  });

  it('findStoresFromProduct should return tiendas by producto', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.id);
    expect(tiendas.length).toBe(5)
  });

  it('findStoresFromProduct should throw an exception for an invalid producto', async () => {
    await expect(() => service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "El producto no fue encontrado");
  });

  it('updateStoresFromProduct should update tiendas list for a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    });

    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
  });

  it('updateStoresFromProduct should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    });

    await expect(() => service.updateStoresFromProduct("0", [newTienda])).rejects.toHaveProperty("message", "El producto no fue encontrado");
  });

  it('updateStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(() => service.updateStoresFromProduct(producto.id, [newTienda])).rejects.toHaveProperty("message", "La tienda no fue encontrada");
  });

  it('deleteTiendaToProducto should remove an tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];

    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({ where: { id: `${producto.id}` }, relations: ["tiendas"] });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteTiendaToProducto should thrown an exception for an invalid tienda', async () => {
    await expect(() => service.deleteStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "La tienda no fue encontrada");
  });

  it('deleteTiendaToProducto should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() => service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto no fue encontrado");
  });

  it('deleteTiendaToProducto should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().substring(0, 3),
      direccion: faker.address.direction()
    });

    await expect(() => service.deleteStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda no esta asociada a el producto");
  });

});