export interface DestinationConstructor {
  new (objectListName: string, syncStartTime: Date): Destination;
}
export interface Destination {
  dropExistingRecordsIfNecessary: () => Promise<void>;
  write: (results: any[]) => Promise<void>;
}
