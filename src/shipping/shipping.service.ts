import { Injectable, BadRequestException } from '@nestjs/common';

export type ShippingZone = 'bangkok' | 'north' | 'south';

@Injectable()
export class ShippingService {
  baseFee(weight: number): number {
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new BadRequestException('weight ต้องมากกว่า 0');
    }

    const firstKgFee = 50;
    if (weight <= 1) {
      return firstKgFee;
    }

    // คำนวณค่าขนส่งสำหรับน้ำหนักเกิน 1 กิโลกรัม
    // Math.ceil() ใช้ปัดเศษขึ้น
    const extraKg = Math.ceil(weight - 1);
    return firstKgFee + extraKg * 18;
  }

  zoneFee(zone: string): number {
    switch (zone.toLowerCase()) {
      case 'bangkok':
        return 0;
      case 'north':
        return 10;
      case 'south':
        return 25;
      default:
        throw new BadRequestException('zone ต้องเป็น bangkok, north หรือ south');
    }
  }

  calculate(
    weight: number,
    zone: string,
  ): {
    weight: number;
    zone: string;
    baseFee: number;
    zoneFee: number;
    totalFee: number;
  } {
    const base = this.baseFee(weight);
    const area = this.zoneFee(zone);

    return {
      weight,
      zone: zone.toLowerCase(),
      baseFee: base,
      zoneFee: area,
      totalFee: base + area,
    };
  }
}
