import { Module, OnModuleInit, Injectable, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

import { MeterModule } from './modules/meter/meter.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

import { Meter } from './modules/meter/entities/meter.entity';
import { MeterLive } from './modules/meter/entities/meter-live.entity';
import { Vehicle } from './modules/vehicle/entities/vehicle.entity';
import { VehicleLive } from './modules/vehicle/entities/vehicle-live.entity';
import { IngestModule } from './modules/ingest/ingest.module';

@Injectable()
export class TestCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async test() {
    const key = 'test-key';
    const value = { message: 'Hello Redis!' };

    try {
      await (this.cacheManager as any).set(key, value, { ttl: 1 });
      // console.log(`Set cache key: ${key}`);

      const cached = await this.cacheManager.get(key);
      console.log('Cached value:', cached);
    } catch (err) {
      console.error('Redis caching error:', err);
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Meter, MeterLive, Vehicle, VehicleLive],
        synchronize: false, 
      }),
    }),

    // ✅ Cache module using ioredis
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST', '127.0.0.1');
        const port = config.get<number>('REDIS_PORT', 6379);
        console.log(`Connecting to Redis at ${host}:${port}`);

        return {
          store: redisStore,        // ioredis store
          ttl: 300,                 // default TTL in seconds
          url: `redis://${host}:${port}`, // important: use url to ensure proper Redis connection
        };
      },
    }),

    // ✅ Feature modules
    MeterModule,
    VehicleModule,
    AnalyticsModule,
    IngestModule,
  ],
  providers: [TestCacheService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly testCacheService: TestCacheService) {}

  async onModuleInit() {
    console.log('🔹 Testing Redis cache...');
    await this.testCacheService.test();
  }
}




