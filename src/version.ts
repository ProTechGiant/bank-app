import staticProps from "./version.json";

export default {
  ...staticProps,
  buildTime: staticProps.buildTime ?? new Date().toISOString(),
};
