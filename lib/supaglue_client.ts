import axios, { AxiosResponse } from "axios";
import querystring from "querystring";

export async function getSupagluePage(
  objectListName: string,
  startingUpdatedAt: Date,
  cursor?: string
): Promise<AxiosResponse<any, any>> {
  const { API_HOST, API_KEY, CUSTOMER_ID, PROVIDER_NAME, PAGE_SIZE } =
    process.env;

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_HOST}/crm/v1/${objectListName}?${querystring.stringify({
      page_size: PAGE_SIZE,
      updated_after: startingUpdatedAt.toISOString(),
      ...{
        ...(cursor && {
          cursor,
        }),
      },
    })}`,
    headers: {
      "x-customer-id": CUSTOMER_ID,
      "x-provider-name": PROVIDER_NAME,
      "x-api-key": API_KEY,
    },
  };

  return await axios.request(config);
}
