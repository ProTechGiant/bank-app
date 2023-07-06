#!/bin/bash
set -e

PREV_BUILD_NUMBER=$(node scripts/source-build-number.js)
# Need to be exported: used in Fastlane
export BUILD_NUMBER=$((PREV_BUILD_NUMBER + 1))

# Update to latest code
git pull origin

# Reset working copy
git reset --hard

# Install/ update dependencies
bundle install
yarn install

# Import secrets file
cp "../secrets/.env.$BUILD_ENVIRONMENT" ".env"
cp "../secrets/fastlane/envs/.env.$BUILD_ENVIRONMENT.secret" "fastlane/envs/.env.secret"

# Build Android version
node scripts/update-build-info.js
bundle exec fastlane android update_version
bundle exec fastlane android build "env:$BUILD_ENVIRONMENT"
bundle exec fastlane tag_build_git

# Upload Android build
bundle exec fastlane android deploy_appcenter "env:$BUILD_ENVIRONMENT"
