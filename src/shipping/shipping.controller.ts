import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ShippingService } from './shipping.service.js';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  convert(
    @Query('weight') weight?: string,
    @Query('zone') zone?: string,
  ) {
    // 1. ค่าที่รับจาก query param เป็นข้อความเสมอ
    const trimmedWeight = weight?.trim();
    const weightNum = Number(trimmedWeight);

    // 2. ตรวจความถูกต้องก่อนส่งให้ Service
    if (!trimmedWeight || Number.isNaN(weightNum)) {
      throw new BadRequestException('weight ต้องเป็นตัวเลข');
    }

    const trimmedZone = zone?.trim();
    if (!trimmedZone) {
      throw new BadRequestException('zone ต้องไม่เป็นค่าว่าง');
    }

    // 3. ส่งค่าที่ตรวจแล้วให้ Service คำนวณ (Service จะตรวจ weight > 0 และ zone เพิ่มเติม)
    return this.shippingService.calculate(weightNum, trimmedZone);
  }
}