import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateMeterDto {
  @IsNotEmpty()
  meterId: string;

  @IsNumber()
  @IsPositive()
  kwhConsumedAc: number;

  @IsNumber()
  voltage: number;
}
