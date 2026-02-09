import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Meter } from '../meter/entities/meter.entity';

@Injectable()
export class AnalyticsService {
  private redis: Redis;

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,

    @InjectRepository(Meter)
    private readonly meterRepo: Repository<Meter>,

    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redis = new Redis({ host, port });
  }

  async getPerformance(vehicleId: string) {
    const cacheKey = `analytics:performance:${vehicleId}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      console.log('Cache HIT for key:', cacheKey, 'value:', JSON.parse(cached));
      return JSON.parse(cached);
    }

    console.log('Cache MISS for key:', cacheKey, 'computing analytics...');

    const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const vehicleAgg = await this.vehicleRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'totalDc')
      .addSelect('AVG(v.batteryTemp)', 'avgTemp')
      .where('v.vehicleId = :vehicleId AND v.timestamp >= :fromDate', { vehicleId, fromDate })
      .getRawOne();

       // 3️⃣ Check if vehicle exists at all
    if (!vehicleAgg || vehicleAgg.totalDc === null) {
      throw new NotFoundException(`Vehicle with ID "${vehicleId}" not found or has no data in the last 24 hours.`);
    }

    const meterAgg = await this.meterRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'totalAc')
      .where('m.timestamp >= :fromDate', { fromDate })
      .getRawOne();

    const totalDc = parseFloat(vehicleAgg?.totalDc) || 0;
    const totalAc = parseFloat(meterAgg?.totalAc) || 0;

    const response = {
      vehicleId,
      totalAc,
      totalDc,
      efficiency: totalAc > 0 ? totalDc / totalAc : 0,
      avgBatteryTemp: parseFloat(vehicleAgg?.avgTemp) || 0,
    };

    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 1);
    console.log('Cached analytics key:', cacheKey);

    return response;
  }
}