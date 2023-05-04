/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");

function sourceBuildNumber() {
  const buildType = process.env.BUILD_ENVIRONMENT;

  const lastBuildTag = execSync(`git tag -l --sort=-version:refname "builds/${buildType}/*" | head -1`).toString();
  const lastBuildVersion = lastBuildTag.substring(lastBuildTag.lastIndexOf("/") + 1);
  const lastBuildNumber = lastBuildVersion.substring(lastBuildVersion.lastIndexOf(".") + 1);

  return lastBuildNumber;
}

console.log(sourceBuildNumber());
