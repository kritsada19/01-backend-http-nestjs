import { Injectable, BadRequestException } from '@nestjs/common';

export type FineItemType = 'general' | 'reserve' | 'reference';

export interface FineResult {
  days: number;
  type: FineItemType;
  chargeableDays: number;
  rate: number;
  total: number;
}

@Injectable()
export class FineService {
  private readonly graceDays = 3;
  private readonly maxFine = 500;

  // เรตราคาหนังสือละประเภท
  private getRate(type: string): number {
    switch (type.toLowerCase()) {
      case 'general':
        return 5;
      case 'reserve':
        return 20;
      case 'reference':
        return 50;
      default:
        throw new BadRequestException(
          'type ต้องเป็น general, reserve หรือ reference',
        );
    }
  }

  calculate(days: number, type: string): FineResult {
    if (!Number.isInteger(days) || days < 0) {
      throw new BadRequestException('days ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
    }

    const normalizedType = type.trim().toLowerCase() as FineItemType;
    const rate = this.getRate(normalizedType);

    // ผ่อนผัน 3 วันแรก วันที่เกินจากนั้นคือจำนวนวันที่ต้องคิดค่าปรับ
    const chargeableDays = Math.max(0, days - this.graceDays);

    // คำนวณยอดรวมและจำกัดเพดานสูงสุดไม่เกิน 500 บาท
    const rawTotal = chargeableDays * rate;
    const total = Math.min(this.maxFine, rawTotal);

    return {
      days,
      type: normalizedType,
      chargeableDays,
      rate,
      total,
    };
  }
}
