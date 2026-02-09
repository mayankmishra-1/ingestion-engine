import { Module } from '@nestjs/common';
import { MeterModule } from '../meter/meter.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { IngestController } from './ingest.controller';

@Module({
  imports: [MeterModule, VehicleModule],
  controllers: [IngestController],
})
export class IngestModule {}
