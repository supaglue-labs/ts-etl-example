export function debugLogRequestStart(objectListName: string) {
  const requestStartTime = Date.now();
  console.log(`request started for ${objectListName}`);
  return requestStartTime;
}

export function debugLogRequestEnd(
  objectListName: string,
  startEpoch: number,
  numRecords: number
) {
  console.log(
    `request finished for ${objectListName}. elapsed: ${
      Date.now() - startEpoch
    }ms. ${numRecords} records.`
  );
  console.log(`writing started for ${objectListName}`);
  const writeStartTime = Date.now();
}

export function debugLogWriteStart(objectListName: string) {
  const requestStartTime = Date.now();
  console.log(`write started for ${objectListName}`);
  return requestStartTime;
}

export function debugLogWriteEnd(objectListName: string, startEpoch: number) {
  console.log(
    `write finished for ${objectListName}. elapsed: ${
      Date.now() - startEpoch
    }ms.`
  );
}
