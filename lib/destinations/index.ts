export interface DestinationConstructor {
  new (objectListName: string, syncStartTime: Date): Destination;
}
export interface Destination {
  write: (results: any[]) => Promise<void>;
}
