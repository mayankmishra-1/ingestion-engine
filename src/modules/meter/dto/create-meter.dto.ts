// src/modules/meter/dto/create-meter.dto.ts
export class CreateMeterDto {
  meterId: string;
  kwhConsumedAc: number;
  voltage: number;
  timestamp: Date;
}
