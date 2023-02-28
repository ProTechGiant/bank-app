// !TODO: future-us. we need to silence console for PROD environments

export function debug(tag: string, message: string, ...rest: string[]) {
  if (__DEV__) log("debug", tag, message, ...rest);
}

export function info(tag: string, message: string, ...rest: string[]) {
  log("info", tag, message, ...rest);
}

export function warn(tag: string, message: string, ...rest: string[]) {
  log("warn", tag, message, ...rest);
}

function log(level: "debug" | "info" | "warn", tag: string, message: string, ...rest: string[]) {
  // eslint-disable-next-line no-console
  const method = console[level];
  method(`[${tag}]: ${message}`, ...rest);
}
