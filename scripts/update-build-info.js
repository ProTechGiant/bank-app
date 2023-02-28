/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const process = require("process");

function updateBuildInfo() {
  const buildVersion = require(__dirname + "/../package.json").version;
  const buildNumber = process.env.BUILD_NUMBER ?? 0;
  const buildTime = new Date().toISOString();
  const buildType = process.env.BUILD_ENVIRONMENT;

  if (undefined === buildType) {
    throw new Error("Could not update build info. ENV[BUILD_ENVIRONMENT] not available");
  }

  const template = `
    export default {
      version: "${buildVersion}",
      buildNumber: ${parseInt(buildNumber, 10)},
      buildTime: "${buildTime}",
      buildType: "${buildType}",
    };
  `;

  // for usage in the app
  fs.writeFileSync(__dirname + "/../src/version.ts", template.trim());

  // for fastlane
  fs.writeFileSync(
    __dirname + "/../src/version.json",
    JSON.stringify({ version: buildVersion, buildNumber: parseInt(buildNumber, 10), buildTime, buildType })
  );
}

updateBuildInfo();
