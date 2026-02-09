import { Controller, Post, Body } from '@nestjs/common';
import { MeterService } from '../meter/meter.service';
import { VehicleService } from '../vehicle/vehicle.service';

@Controller('v1/ingest')
export class IngestController {
  constructor(
    private readonly meterService: MeterService,
    private readonly vehicleService: VehicleService,
  ) {}

  @Post()
  async ingest(@Body() body: any) {
    const { type, ...data } = body;

    if (type === 'meter') {
      return this.meterService.create(data);  
    } else if (type === 'vehicle') {
      return this.vehicleService.create(data);
    } else {
      return { error: 'Invalid type, must be "meter" or "vehicle"' };
    }
  }
}
