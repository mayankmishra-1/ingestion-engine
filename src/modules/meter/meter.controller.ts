// src/modules/meter/meter.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { MeterService } from './meter.service';
import { CreateMeterDto } from './dto/create-meter.dto';

@Controller('v1/meter')
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Post()
  async ingest(@Body() dto: CreateMeterDto) {
    return this.meterService.create(dto);
  }
}
