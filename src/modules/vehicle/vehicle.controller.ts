import { Controller, Post, Body } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('v1/vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async ingest(@Body() dto: CreateVehicleDto) {
    return this.vehicleService.create(dto); // saves history + live
  }
}

