#!/bin/bash
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

# Build iOS version
node scripts/update-build-info.js
bundle exec fastlane ios install_signing
bundle exec fastlane ios update_version
bundle exec fastlane ios build "env:$BUILD_ENVIRONMENT"
bundle exec fastlane tag_build_git

# Upload iOS build
bundle exec fastlane ios deploy_appcenter "env:$BUILD_ENVIRONMENT"
