/* eslint-disable no-console */
import queryString from "query-string";

import ApiError from "./ApiError";

// TODO: get this from environment variables
const baseUrl = ".apps.dev-dmz.projectcroatia.cloud";

export default async function sendApiRequest<TResponse = unknown, TError = unknown>(
  service: string,
  version: string,
  path: string,
  method: string,
  query?: queryString.StringifiableRecord,
  body?: string | Record<string | number, unknown> | undefined,
  headers?: string[][] | { [key: string]: string }
) {
  const fetchUrl = queryString.stringifyUrl({
    query,
    url: "https://" + service + baseUrl + "/" + version + "/" + path,
  });

  if (__DEV__) {
    console.log(`[API] Starting request for ${fetchUrl}`);
    if (undefined !== body) console.log(JSON.stringify(body));
  }

  const response = await fetch(fetchUrl, {
    body: undefined !== body ? (typeof body === "object" ? JSON.stringify(body) : body) : undefined,
    method,
    headers: {
      Host: service + baseUrl,
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const content = (await response.json()) as TResponse | TError;

  if (response.status >= 400) {
    if (__DEV__) console.warn(`[${response.status}][${method}]: ${fetchUrl}: `, content);
    throw new ApiError<TError>(response.statusText, response.status, content as TError);
  }

  return content as TResponse;
}
