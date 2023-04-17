export interface DestinationConstructor {
  new (objectListName: string, syncStartTime: Date): Destination;
}
export interface Destination {
  dropExistingRecordsIfNecessary: () => Promise<void>;
  write: (results: Record<string, any>[]) => Promise<void>;
}
