import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeterModule } from './modules/meter/meter.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { Meter } from './modules/meter/entities/meter.entity';
import { Vehicle } from './modules/vehicle/entities/vehicle.entity';
import { VehicleLive } from './modules/vehicle/entities/vehicle-live.entity';
import { MeterLive } from './modules/meter/entities/meter-live.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes process.env variables accessible throughout your app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Meter, MeterLive, Vehicle, VehicleLive],
        synchronize: true,
      }),
    }),
    MeterModule,
    VehicleModule,
    AnalyticsModule,
  ],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { MeterModule } from './modules/meter/meter.module';
// import { VehicleModule } from './modules/vehicle/vehicle.module';
// import { AnalyticsModule } from './modules/analytics/analytics.module';
// import { Meter } from './modules/meter/entities/meter.entity';
// import { Vehicle } from './modules/vehicle/entities/vehicle.entity';
// import { VehicleLive } from './modules/vehicle/entities/vehicle-live.entity';
// import { MeterLive } from './modules/meter/entities/meter-live.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/fleet_db",
//       entities: [Meter, MeterLive, Vehicle, VehicleLive],
//       synchronize: true,
//     }),
//     MeterModule,
//     VehicleModule,
//     AnalyticsModule,
//   ],
// })
// export class AppModule {}




// // import { Module } from '@nestjs/common';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';

// // @Module({
// //   imports: [],
// //   controllers: [AppController],
// //   providers: [AppService],
// // })
// // export class AppModule {}

// //


