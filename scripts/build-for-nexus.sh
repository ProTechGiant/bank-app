PREV_BUILD_TAG=$(git tag -l --sort=-version:refname "builds/test/*" | tail -1)
PREV_BUILD_TAG_END_IDX=$(echo $PREV_BUILD_TAG | grep -b -o - | cut -d: -f1)

PREV_BUILD_NUMBER=$(echo $PREV_BUILD_TAG | cut -c "13-$PREV_BUILD_TAG_END_IDX")
export BUILD_NUMBER=$((PREV_BUILD_NUMBER + 1))
export BUILD_ENVIRONMENT="test"

# Update to latest code
git pull origin main

# Install/ update dependencies
yarn install
npx pod-install
bundle install

# Build Android version
bundle exec fastlane update_version
bundle exec fastlane android build "env:$BUILD_ENVIRONMENT"
bundle exec fastlane tag_build_git

# Upload to Nexus
BUILD_TIME="$(date +'%Y%m%d%H%M')"
ANDROID_INPUT_NAME="app-accept-release.apk"
ANDROID_OUTPUT_NAME="release-$BUILD_TIME-b$BUILD_NUMBER.apk"

curl -v -u mobile:c7oY08v3hU8F -X POST "https://nexus.projectcroatia.cloud/service/rest/internal/ui/upload/ios-builds" \
  -F asset0="C:\fakepath\app-accept-release.apk" \
  -F asset0.filename="$ANDROID_OUTPUT_NAME" \
  -F directory="android-$BUILD_ENVIRONMENT" \
  -F asset0="@fastlane/builds/test/$ANDROID_INPUT_NAME"
