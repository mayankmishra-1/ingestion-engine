// src/modules/vehicle/vehicle.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLive } from './entities/vehicle-live.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleLive])],
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule {}
