// src/modules/vehicle/entities/vehicle-live.entity.ts
import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('vehicle_live')
export class VehicleLive {
  @PrimaryColumn()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
