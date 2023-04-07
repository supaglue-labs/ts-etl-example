import { PrismaClient } from '@prisma/client';

// Keep a watermark for each object type. The set() watermark can be persisted for durability or reset() to trigger a full sync.
export class WatermarkManager {
  #prisma: PrismaClient;
  constructor() {
    this.#prisma = new PrismaClient();
  }

  async get(objectListName: string, customerId: string, providerName: string): Promise<Date> {
    const res = await this.#prisma.watermarks.findUnique({
      where: {
        customerId_providerName_commonModel: {
          customerId,
          providerName,
          commonModel: objectListName,
        },
      },
    });
    return res?.watermark ?? new Date(0);
  }

  async set(objectListName: string, customerId: string, providerName: string, date: Date) {
    await this.#prisma.watermarks.upsert({
      where: {
        customerId_providerName_commonModel: {
          customerId,
          providerName,
          commonModel: objectListName,
        },
      },
      update: {
        watermark: date,
      },
      create: {
        customerId,
        providerName,
        commonModel: objectListName,
        watermark: date,
      },
    });
  }
}
