#!/bin/bash
set -e

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

# Build iOS version
node scripts/update-build-info.js
bundle exec fastlane ios install_signing
bundle exec fastlane ios update_version
bundle exec fastlane ios build "env:$BUILD_ENVIRONMENT"
bundle exec fastlane tag_build_git

# Upload iOS build
bundle exec fastlane ios deploy_appcenter "env:$BUILD_ENVIRONMENT"
