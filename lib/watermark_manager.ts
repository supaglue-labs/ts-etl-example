// Keep a watermark for each object type. The set() watermark can be persisted for durability or reset() to trigger a full sync.
export class WatermarkManager {
  private maxLastModifiedAtList: {
    objectListName: string;
    customerId: string;
    providerName: string;
    date: Date;
  }[] = [];

  get(objectListName: string, customerId: string, providerName: string): any {
    return this.maxLastModifiedAtList.find((watermark) => 
      watermark.objectListName === objectListName &&
      watermark.customerId === customerId &&
      watermark.providerName === providerName
    )?.date ?? new Date(0);
  }

  set(objectListName: string, customerId: string, providerName: string, date: Date) {
    const existingWatermark = this.maxLastModifiedAtList.find((watermark) =>
      watermark.objectListName === objectListName &&
      watermark.customerId === customerId &&
      watermark.providerName === providerName
    );

    if (existingWatermark) {
      existingWatermark.date = date;
      return;
    }

    this.maxLastModifiedAtList.push({
      objectListName,
      customerId,
      providerName,
      date,
    });
  }
}
