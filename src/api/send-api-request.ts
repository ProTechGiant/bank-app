import { API_BASE_URL } from "@env";
import NetInfo from "@react-native-community/netinfo";
import i18next from "i18next";
import truncate from "lodash/truncate";
import queryString from "query-string";

import { info, warn } from "@/logger";

import ApiError from "./ApiError";
import { getDeviceInfo } from "./deviceDetails";
import ResponseError from "./ResponseError";

type Headers = Record<string, string>;
let authenticationHeaders: Headers = {};

export function setAuthenticationHeaders(value: Headers) {
  authenticationHeaders = value;
}

let memoizedDeviceInfo: { [key: string]: string };

export default async function sendApiRequest<TResponse = unknown, TError = ResponseError>(
  version: string,
  path: string,
  method: string,
  query?: queryString.StringifiableRecord,
  body?: string | object | undefined,
  headers: { [key: string]: string } = {}
) {
  console.log("API HEADERS BEFORE REQUEST: ", { ...authenticationHeaders, ...headers });

  const fetchUrl = queryString.stringifyUrl({
    query,
    url: "https://" + API_BASE_URL + "/" + version + "/" + path,
  });

  if (undefined !== body && typeof body === "object") {
    headers["Content-Type"] = "application/json";
  }

  const deviceInfo =
    memoizedDeviceInfo !== undefined ? memoizedDeviceInfo : (memoizedDeviceInfo = await getDeviceInfo());
  console.log("DEVICE INFO HEADERS BEFORE REQUEST: ", { ...deviceInfo });

  if (__DEV__) {
    info("api", `Starting request for ${method} ${fetchUrl} with body: ${JSON.stringify(body)}`);
  }

  const isNetworkConnected = await isConnected();
  if (!isNetworkConnected) {
    throw new ApiError<TError>("ERROR: No internet connection", 503, "No internet connection" as TError);
  }

  const response = await fetch(fetchUrl, {
    body: undefined !== body ? (typeof body === "object" ? JSON.stringify(body) : body) : undefined,
    method,
    headers: {
      Host: API_BASE_URL,
      ...deviceInfo,
      ...authenticationHeaders,
      ["Accept-Language"]: i18next.language.toUpperCase(),
      ...headers,
    },
  });

  let content: TResponse | undefined;

  try {
    const isJsonResponse = response.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
    content = isJsonResponse ? await response.json() : await response.text();
  } catch (error) {
    if (__DEV__) {
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
    response: content,
    error: content,
    path: `${version}/${path}`,
  });

  if (response.status >= 400) {
    if (__DEV__) {
      warn("api", `Received ${response.status} for ${fetchUrl}: `, JSON.stringify(content));
    }

    throw new ApiError<TError>(response?.statusText, response.status, content as TError);
  }

  if (__DEV__) {
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
  console.log("RESPONSE", isSuccess ? response : { statusText: response?.statusText, status: response.status, error });
  console.groupEnd();
}

export function isConnected() {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        resolve(state.isConnected);
      } else {
        reject(state.isConnected);
      }
    });
  });
}
