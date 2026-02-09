// src/modules/vehicle/vehicle.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLive } from './entities/vehicle-live.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleLive)
    private vehicleLiveRepo: Repository<VehicleLive>,
  ) {}

  // Append-only history + live UPSERT
  async create(dto: CreateVehicleDto) {
    await this.vehicleRepo.save(dto);
    return this.upsertLive(dto);
  }

  async upsertLive(dto: CreateVehicleDto) {
    await this.vehicleLiveRepo.save({
      vehicleId: dto.vehicleId,
      soc: dto.soc,
      kwhDeliveredDc: dto.kwhDeliveredDc,
      batteryTemp: dto.batteryTemp,
    });
  }
}


// @Injectable()
// export class VehicleService {
//   constructor(
//     @InjectRepository(Vehicle)
//     private vehicleRepo: Repository<Vehicle>,
//   ) {}

//   async create(data: CreateVehicleDto) {
//     return this.vehicleRepo.save(data); // append-only for history
//   }

//   async upsertCurrentStatus(data: CreateVehicleDto) {
//     return this.vehicleRepo.save(data); // UPSERT for live view
//   }
// }
