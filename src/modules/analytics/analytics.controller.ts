import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance/:vehicleId')
  async performance(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getPerformance(vehicleId);
  }
}

