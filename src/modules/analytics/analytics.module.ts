import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Meter } from '../meter/entities/meter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Meter])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
