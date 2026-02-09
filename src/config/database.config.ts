import { DataSource } from 'typeorm';
import { Meter } from '../modules/meter/entities/meter.entity';
import { Vehicle } from '../modules/vehicle/entities/vehicle.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // for dev only, use migrations in prod
  logging: false,
  entities: [Meter, Vehicle],
});
