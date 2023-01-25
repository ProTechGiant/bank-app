/* eslint-disable no-console */
import queryString from "query-string";

import ApiError from "./ApiError";

export interface ResponseError {
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
}

// TODO: get this from environment variables
const baseUrl = ".apps.dev-dmz.projectcroatia.cloud";
const APIKey = "564c0148-56a1-11ed-9b6a-0242ac120002";

export default async function sendApiRequest<TResponse = unknown, TError = ResponseError>(
  service: string,
  version: string,
  path: string,
  method: string,
  query?: queryString.StringifiableRecord,
  body?: string | Record<string | number, unknown> | undefined,
  headers: { [key: string]: string } = {}
) {
  const fetchUrl = queryString.stringifyUrl({
    query,
    url: "https://" + service + baseUrl + "/" + version + "/" + path,
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
      Host: service + baseUrl,
      "X-API-KEY": APIKey,
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
