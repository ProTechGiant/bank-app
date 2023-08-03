#!/bin/sh
set -e

# Update to latest code
git pull origin

# Reset working copy
git reset --hard

# Install/ update dependencies
bundle install
yarn install

# Set environment secrets
source ../secrets/set-env-vars.sh

# Build Android version
node scripts/update-build-info.js
bundle exec fastlane android update_version
bundle exec fastlane android build "env:$BUILD_ENVIRONMENT"
bundle exec fastlane tag_build_git

# Upload Android build
bundle exec fastlane android deploy_appcenter "env:$BUILD_ENVIRONMENT"
