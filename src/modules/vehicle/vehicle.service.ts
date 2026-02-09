import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import type { Cache } from 'cache-manager';


import { Vehicle } from './entities/vehicle.entity';
import { VehicleLive } from './entities/vehicle-live.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,

    @InjectRepository(VehicleLive)
    private readonly vehicleLiveRepo: Repository<VehicleLive>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateVehicleDto) {
    await this.vehicleRepo.save(dto);

    await this.vehicleLiveRepo.save({
      vehicleId: dto.vehicleId,
      soc: dto.soc,
      kwhDeliveredDc: dto.kwhDeliveredDc,
      batteryTemp: dto.batteryTemp,
    });

    await this.cacheManager.del(
      `analytics:performance:${dto.vehicleId}`,
    );

    return { status: 'ok' };
  }
}





