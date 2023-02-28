import { API_BASE_URL } from "@env";
import truncate from "lodash/truncate";
import queryString from "query-string";

import { info, warn } from "@/logger";

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

  info("API", `Starting request for ${fetchUrl} with body: ${JSON.stringify(body)}`);

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
  } catch (error) {
    warn("API", `${fetchUrl}: Could not parse response content: ${(error as Error).message}`);
  }

  if (response.status >= 400) {
    warn("API", `Received ${response.status} for ${fetchUrl}: `, JSON.stringify(content));
    throw new ApiError<TError>(response.statusText, response.status, content as TError);
  }

  info("api", `Received content for ${fetchUrl}: `, truncate(JSON.stringify(content), { length: 100 }));

  return content as TResponse;
}
