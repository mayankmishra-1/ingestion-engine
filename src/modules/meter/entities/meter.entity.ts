import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Meter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @CreateDateColumn()
  timestamp: Date;
}
