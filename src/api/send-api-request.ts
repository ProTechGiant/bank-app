import { API_BASE_URL } from "@env";
import truncate from "lodash/truncate";
import queryString from "query-string";
import { getDeviceName } from "react-native-device-info";

import { info, warn } from "@/logger";
import { getUniqueDeviceId } from "@/utils";

import ApiError from "./ApiError";
import ResponseError from "./ResponseError";

type Headers = Record<string, string>;
let authenticationHeaders: Headers = {};

export function setAuthenticationHeaders(value: Headers) {
  authenticationHeaders = value;
}

let memoizedDeviceId: string;
let memoizedDeviceName: string;

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

  // eslint-disable-next-line prettier/prettier
  const deviceId = memoizedDeviceId !== undefined
    ? memoizedDeviceId
    : (memoizedDeviceId = await getUniqueDeviceId());
  // eslint-disable-next-line prettier/prettier
  const deviceName = memoizedDeviceName !== undefined
    ? memoizedDeviceName
    : (memoizedDeviceName = await getDeviceName());

  if (!__DEV) {
    info("api", `Starting request for ${method} ${fetchUrl} with body: ${JSON.stringify(body)}`);
  }

  const response = await fetch(fetchUrl, {
    body: undefined !== body ? (typeof body === "object" ? JSON.stringify(body) : body) : undefined,
    method,
    headers: {
      Host: API_BASE_URL,
      ["X-Device-Id"]: deviceId,
      ["X-Device-Name"]: deviceName,
      ...authenticationHeaders,
      ...headers,
    },
  });

  let content: TResponse | undefined;

  try {
    const isJsonResponse = response.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
    content = isJsonResponse ? await response.json() : await response.text();
  } catch (error) {
    if (!__DEV) {
      warn("api", `${method} ${fetchUrl}: Could not parse response content: ${(error as Error).message}`);
    }

    logGroup(false, { method, fetchUrl, error, path: `${version}/${path}` }, true);
  }

  logGroup(response.status < 400, {
    method,
    fetchUrl,
    body,
    headers,
    authenticationHeaders,
    response,
    error: content,
    path: `${version}/${path}`,
  });

  if (response.status >= 400) {
    if (!__DEV) {
      warn("api", `Received ${response.status} for ${fetchUrl}: `, JSON.stringify(content));
    }

    throw new ApiError<TError>(response.statusText, response.status, content as TError);
  }

  if (!__DEV) {
    info("api", `Received content for ${method} ${fetchUrl}: `, truncate(JSON.stringify(content), { length: 100 }));
  }

  return content as TResponse;
}

function logGroup(isSuccess: boolean, properties: any, isParseError?: boolean) {
  const { method, fetchUrl, body, headers, authenticationHeaders, error, response, path } = properties;

  if (isParseError) {
    console.log(
      `%c Failure `,
      `background: red; color: white;`,
      `${fetchUrl}: Could not parse response content: ${(error as Error).message}`
    );
    return;
  }

  console.group(
    `%c ${isSuccess ? "Success " : "Failure "}`,
    `background: ${isSuccess ? "green" : "red"}; color: white;`,
    `${path}`
  );
  console.log("REQUEST", { method, fetchUrl, body, headers, authenticationHeaders });
  console.log("RESPONSE", isSuccess ? response : { statusText: response.statusText, status: response.status, error });
  console.groupEnd();
}
