import { Injectable, BadRequestException } from '@nestjs/common';

export type ElectricityCustomerType = 'residential' | 'business';

export interface ElectricityResult {
  units: number;
  type: ElectricityCustomerType;
  energyCharge: number;
  serviceCharge: number;
  total: number;
}

@Injectable()
export class ElectricityService {
  private readonly tierLimit = 150;
  private readonly firstTierRate = 3;
  private readonly excessTierRate = 4;

  // ดึงราคาตามประเภท
  private getServiceCharge(type: string): number {
    switch (type.toLowerCase()) {
      case 'residential':
        return 40;
      case 'business':
        return 90;
      default:
        throw new BadRequestException('type ต้องเป็น residential หรือ business');
    }
  }

  private getEnergyCharge(units: number): number {
    // 150 หน่วยแรก
    const firstTierUnits = Math.min(units, this.tierLimit);

    // หน่วยที่เกินจาก 150 หน่วย 
    const excessUnits = Math.max(0, units - this.tierLimit);

    return (
      firstTierUnits * this.firstTierRate + excessUnits * this.excessTierRate
    );
  }

  calculate(units: number, type: string): ElectricityResult {
    if (!Number.isInteger(units) || units < 0) {
      throw new BadRequestException('units ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
    }

    const normalizedType = type.trim().toLowerCase() as ElectricityCustomerType;
    const energyCharge = this.getEnergyCharge(units);
    const serviceCharge = this.getServiceCharge(normalizedType);

    return {
      units,
      type: normalizedType,
      energyCharge,
      serviceCharge,
      total: energyCharge + serviceCharge,
    };
  }
}
