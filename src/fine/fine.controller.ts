import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { FineService } from './fine.service.js';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Get()
  getFine(
    @Query('days') days?: string,
    @Query('type') type?: string,
  ) {
    const trimmedDays = days?.trim();
    const daysNum = Number(trimmedDays);

    if (!trimmedDays || !Number.isInteger(daysNum) || daysNum < 0) {
      throw new BadRequestException('days ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
    }

    const trimmedType = type?.trim().toLowerCase();
    if (!trimmedType) {
      throw new BadRequestException('type ต้องไม่เป็นค่าว่าง');
    }

    return this.fineService.calculate(daysNum, trimmedType);
  }
}