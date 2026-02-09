// src/modules/meter/entities/meter-live.entity.ts
import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('meter_live')
export class MeterLive {
  @PrimaryColumn()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
