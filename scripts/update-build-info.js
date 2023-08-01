/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const process = require("process");
const path = require("path");

const packageJsonFile = path.join(__dirname, "..", "package.json");
const versionJsonFile = path.join(__dirname, "..", "src", "version.json");

function updateBuildVersion() {
  const buildNumber = process.env.BUILD_ID ?? 0;
  const packageJson = require(packageJsonFile);

  // <<year>>.<<build cycle>>.<<build number>>
  const version = packageJson.version;
  packageJson.version = version.split(".").slice(0, 2).join(".") + "." + buildNumber;

  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, undefined, 2));
}

function updateEmbeddedConfiguration() {
  const buildVersion = require(packageJsonFile).version;
  const buildNumber = buildVersion.substring(buildVersion.lastIndexOf("."));
  const buildTime = new Date().toISOString();
  const buildType = process.env.BUILD_ENVIRONMENT;

  if (buildType === undefined) {
    throw new Error("Could not update build info. ENV[BUILD_ENVIRONMENT] not available");
  }

  const properties = {
    buildTime,
    buildType,
    version: buildVersion,
    buildNumber: parseInt(buildNumber, 10),
  };

  fs.writeFileSync(versionJsonFile, JSON.stringify(properties, undefined, 2));
}

updateBuildVersion();
updateEmbeddedConfiguration();
