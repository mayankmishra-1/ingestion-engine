import { DataSource } from 'typeorm';
import { Meter } from '../modules/meter/entities/meter.entity';
import { Vehicle } from '../modules/vehicle/entities/vehicle.entity';
import { VehicleLive } from 'src/modules/vehicle/entities/vehicle-live.entity';
import { MeterLive } from 'src/modules/meter/entities/meter-live.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, 
  logging: false,
  entities: [Meter, MeterLive, Vehicle, VehicleLive],
});
