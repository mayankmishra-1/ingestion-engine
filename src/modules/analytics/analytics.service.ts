// src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Meter } from '../meter/entities/meter.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Meter)
    private meterRepo: Repository<Meter>,
  ) {}

  async getPerformance(vehicleId: string) {
    const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Aggregate vehicle data in 24h window
    const vehicleAgg = await this.vehicleRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'totalDc')
      .addSelect('AVG(v.batteryTemp)', 'avgTemp')
      .where('v.vehicleId = :vehicleId AND v.timestamp >= :fromDate', { vehicleId, fromDate })
      .getRawOne();

    // Aggregate meter data in 24h window
    const meterAgg = await this.meterRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'totalAc')
      .where('m.timestamp >= :fromDate', { fromDate })
      .getRawOne();

    return {
      vehicleId,
      totalAc: parseFloat(meterAgg.totalAc) || 0,
      totalDc: parseFloat(vehicleAgg.totalDc) || 0,
      efficiency: vehicleAgg.totalDc && meterAgg.totalAc ? parseFloat(vehicleAgg.totalDc) / parseFloat(meterAgg.totalAc) : 0,
      avgBatteryTemp: parseFloat(vehicleAgg.avgTemp) || 0,
    };
  }
}







// // src/modules/analytics/analytics.service.ts
// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Vehicle } from '../vehicle/entities/vehicle.entity';
// import { Meter } from '../meter/entities/meter.entity';

// @Injectable()
// export class AnalyticsService {
//   constructor(
//     @InjectRepository(Vehicle)
//     private vehicleRepo: Repository<Vehicle>,
//     @InjectRepository(Meter)
//     private meterRepo: Repository<Meter>,
//   ) {}

//   async getPerformance(vehicleId: string) {
//     // 24-hour window
//     const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const vehicleData = await this.vehicleRepo
//       .createQueryBuilder('v')
//       .where('v.vehicleId = :vehicleId AND v.timestamp >= :fromDate', { vehicleId, fromDate })
//       .getMany();

//     const meterData = await this.meterRepo
//       .createQueryBuilder('m')
//       .where('m.timestamp >= :fromDate', { fromDate })
//       .getMany();

//     const totalDc = vehicleData.reduce((sum, v) => sum + v.kwhDeliveredDc, 0);
//     const avgTemp = vehicleData.reduce((sum, v) => sum + v.batteryTemp, 0) / vehicleData.length || 0;
//     const totalAc = meterData.reduce((sum, m) => sum + m.kwhConsumedAc, 0);

//     return {
//       vehicleId,
//       totalAc,
//       totalDc,
//       efficiency: totalDc / totalAc,
//       avgBatteryTemp: avgTemp,
//     };
//   }
// }
