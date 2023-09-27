import { API_BASE_URL } from "@env";
import truncate from "lodash/truncate";
import queryString from "query-string";
import DeviceInfo from "react-native-device-info";

import { info, warn } from "@/logger";
import { getUniqueDeviceId } from "@/utils";

import ApiError from "./ApiError";
import ResponseError from "./ResponseError";

type Headers = Record<string, string>;
let authenticationHeaders: Headers = {};

export function setAuthenticationHeaders(value: Headers) {
  authenticationHeaders = value;
}

export default async function sendApiRequest<TResponse = unknown, TError = ResponseError>(
  version: string,
  path: string,
  method: string,
  query?: queryString.StringifiableRecord,
  body?: string | object | undefined,
  headers: { [key: string]: string } = {}
) {
  const fetchUrl = queryString.stringifyUrl({
    query,
    url: "https://" + API_BASE_URL + "/" + version + "/" + path,
  });

  if (undefined !== body && typeof body === "object") {
    headers["Content-Type"] = "application/json";
  }
  const deviceId = (await getUniqueDeviceId()) || "";
  const deviceName = (await DeviceInfo.getDeviceName()) || "";

  info("api", `Starting request for ${method} ${fetchUrl} with body: ${JSON.stringify(body)}`);

  const response = await fetch(fetchUrl, {
    body: undefined !== body ? (typeof body === "object" ? JSON.stringify(body) : body) : undefined,
    method,
    headers: {
      Host: API_BASE_URL,
      ["x-device-id"]: deviceId,
      ["x-device-name"]: deviceName,
      ...authenticationHeaders,
      ...headers,
    },
  });

  let content: TResponse | undefined;

  try {
    const isJsonResponse = response.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
    content = isJsonResponse ? await response.json() : await response.text();
  } catch (error) {
    warn("api", `${method} ${fetchUrl}: Could not parse response content: ${(error as Error).message}`);
  }

  if (response.status >= 400) {
    warn("api", `Received ${response.status} for ${fetchUrl}: `, JSON.stringify(content));
    throw new ApiError<TError>(response.statusText, response.status, content as TError);
  }

  info("api", `Received content for ${method} ${fetchUrl}: `, truncate(JSON.stringify(content), { length: 100 }));

  return content as TResponse;
}
