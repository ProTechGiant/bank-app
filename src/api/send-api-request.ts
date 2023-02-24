/* eslint-disable no-console */
import { API_BASE_URL } from "@env";
import queryString from "query-string";

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

  if (__DEV__) {
    console.log(`[API] Starting request for ${fetchUrl} with headers: `, JSON.stringify(headers));
    if (undefined !== body) console.log(JSON.stringify(body));
  }

  if (undefined !== body && typeof body === "object") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(fetchUrl, {
    body: undefined !== body ? (typeof body === "object" ? JSON.stringify(body) : body) : undefined,
    method,
    headers: {
      Host: API_BASE_URL,
      ...authenticationHeaders,
      ...headers,
    },
  });

  let content = undefined;
  try {
    const isJsonResponse = response.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;
    content = isJsonResponse ? await response.json() : await response.text();
  } catch (_error) {
    __DEV__ && console.warn(`[API]: ${fetchUrl}: Could not parse response content`);
  }

  if (response.status >= 400) {
    if (__DEV__) console.warn(`[${response.status}][${method}]: ${fetchUrl}: `, JSON.stringify(content));
    throw new ApiError<TError>(response.statusText, response.status, content as TError);
  }

  return content as TResponse;
}
