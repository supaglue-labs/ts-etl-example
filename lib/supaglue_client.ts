import axios, { AxiosResponse } from "axios";
import querystring from "querystring";

export async function getSupagluePage(
  objectListName: string,
  customerId: string,
  providerName: string,
  startingLastModifiedAt: Date,
  cursor?: string
): Promise<AxiosResponse<any, any>> {
  const { API_HOST, API_KEY, PROVIDER_NAME, PAGE_SIZE = 1000 } = process.env;

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_HOST}/crm/v1/${objectListName}?${querystring.stringify({
      page_size: PAGE_SIZE,
      modified_after: startingLastModifiedAt.toISOString(),
      ...{
        ...(cursor && {
          cursor,
        }),
      },
    })}`,
    headers: {
      "x-customer-id": customerId,
      "x-provider-name": providerName,
      "x-api-key": API_KEY,
    },
  };

  const response = await axios.request(config);

  if (response.status >= 300 && response.status < 500) {
    console.log("Request error", response.statusText);
    throw new Error("Request error");
  }

  return response;
}
