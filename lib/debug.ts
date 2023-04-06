export function debugLogRequestStart(objectListName: string, customerId: string, providerName: string) {
  const requestStartTime = Date.now();
  console.log(`request started for ${objectListName}, ${customerId}, ${providerName}`);
  return requestStartTime;
}

export function debugLogRequestEnd(
  objectListName: string,
  customerId: string,
  providerName: string,
  startEpoch: number,
  numRecords: number
) {
  console.log(
    `request finished for ${objectListName}. elapsed: ${
      Date.now() - startEpoch
    }ms. ${numRecords} records.`
  );
  console.log(`writing started for ${objectListName}, ${customerId}, ${providerName}`);
  const writeStartTime = Date.now();
}

export function debugLogWriteStart(objectListName: string, customerId: string, providerName: string) {
  const requestStartTime = Date.now();
  console.log(`write started for ${objectListName}, ${customerId}, ${providerName}`);
  return requestStartTime;
}

export function debugLogWriteEnd(objectListName: string, customerId: string, providerName: string, startEpoch: number) {
  console.log(
    `write finished for ${objectListName}, ${customerId}, ${providerName}. elapsed: ${
      Date.now() - startEpoch
    }ms.`
  );
}
