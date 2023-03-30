// Keep a watermark for each object type. The set() watermark can be persisted for durability or reset() to trigger a full sync.
export class WatermarkManager {
  private lastLastModifiedAt: Record<string, Date> = {
    contacts: new Date(0),
    leads: new Date(0),
    accounts: new Date(0),
    opportunities: new Date(0),
    users: new Date(0),
  };

  get(objectListName: string): any {
    return this.lastLastModifiedAt[objectListName];
  }
  set(objectListName: string, date: Date) {
    this.lastLastModifiedAt[objectListName] = date;
  }
}
