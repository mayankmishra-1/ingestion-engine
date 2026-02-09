export class CreateVehicleDto {
  vehicleId: string;
  soc: number;
  kwhDeliveredDc: number;
  batteryTemp: number;
  timestamp: Date;
}
