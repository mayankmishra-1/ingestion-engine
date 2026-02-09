import { IsNotEmpty, IsNumber, IsPositive, IsOptional, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  vehicleId: string;

  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'SOC cannot be less than 0' })
  @Max(100, { message: 'SOC cannot be greater than 100' })
  soc: number;

  @IsNumber()
  @IsPositive()
  kwhDeliveredDc: number;

  @IsNumber()
  @IsOptional()
  batteryTemp?: number; 

}
