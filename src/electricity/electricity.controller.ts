import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ElectricityService } from './electricity.service.js';

@Controller('electricity')
export class ElectricityController {
  constructor(private readonly electricityService: ElectricityService) {}

  @Get()
  getElectricity(
    @Query('units') units?: string,
    @Query('type') type?: string,
  ) {
    const trimmedUnits = units?.trim();
    const unitsNum = Number(trimmedUnits);

    if (!trimmedUnits || Number.isNaN(unitsNum)) {
      throw new BadRequestException('units ต้องเป็นตัวเลข');
    }

    const trimmedType = type?.trim().toLowerCase();
    if (!trimmedType) {
      throw new BadRequestException('type ต้องไม่เป็นค่าว่าง');
    }

    return this.electricityService.calculate(unitsNum, trimmedType);
  }
}