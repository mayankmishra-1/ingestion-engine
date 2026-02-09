// src/modules/meter/meter.module.ts
import { Module } from '@nestjs/common';
import { MeterService } from './meter.service';
import { MeterController } from './meter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from './entities/meter.entity';
import { MeterLive } from './entities/meter-live.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Meter, MeterLive])],
  providers: [MeterService],
  controllers: [MeterController],
  exports: [MeterService],
})
export class MeterModule {}
