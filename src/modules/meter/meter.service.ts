import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from './entities/meter.entity';
import { MeterLive } from './entities/meter-live.entity';
import { CreateMeterDto } from './dto/create-meter.dto';

@Injectable()
export class MeterService {
  constructor(
    @InjectRepository(Meter)
    private meterRepo: Repository<Meter>,
    @InjectRepository(MeterLive)
    private meterLiveRepo: Repository<MeterLive>,
  ) {}

  async create(dto: CreateMeterDto) {
    await this.meterRepo.save(dto);
    return this.upsertLive(dto);
  }

  async upsertLive(dto: CreateMeterDto) {
    await this.meterLiveRepo.save({
      meterId: dto.meterId,
      kwhConsumedAc: dto.kwhConsumedAc,
      voltage: dto.voltage,
    });
  }
}






