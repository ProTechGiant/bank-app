import { APPSFLYER_DEV_KEY, APPSFLYER_IOS_APP_KEY } from "@env";
import { useEffect } from "react";
import { Platform } from "react-native";
import appsFlyer from "react-native-appsflyer";
import * as permissions from "react-native-permissions";

import { warn } from "@/logger";
import version from "@/version";

export default function useAppsFlyer() {
  useEffect(() => {
    async function requestTrackingPermission() {
      if (Platform.OS !== "ios") return;

      try {
        const status = await permissions.check(permissions.PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

        if (status === permissions.RESULTS.DENIED) {
          await permissions.request(permissions.PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        }
      } catch (error) {
        warn("appsflyer-sdk", "Could not request for iOS ATT permission: ", JSON.stringify(error));
      }
    }

    async function initializeSdk() {
      appsFlyer.setAppInviteOneLinkID("vtqe");

      // User clicks the OneLink short URL.
      // The iOS Universal Links/ Android App Links (for deep linking) or the deferred deep link, trigger the SDK.
      // The SDK triggers the onDeepLink listener, and passes the deep link result object to the user.
      // The onDeepLink listener uses the deep link result object that includes the deep_link_value and other parameters to create the personalized experience for the users, which is the main goal of OneLink.
      appsFlyer.onDeepLink(result => {
        if (result.deepLinkStatus !== "FOUND") return;
        console.log("appsFlyer.onDeepLink", JSON.stringify(result, undefined, 2));
      });

      try {
        await appsFlyer.initSdk({
          devKey: APPSFLYER_DEV_KEY,
          isDebug: ["test", "eit"].includes(version.buildType),
          appId: Platform.OS === "ios" ? APPSFLYER_IOS_APP_KEY : undefined,
          timeToWaitForATTUserAuthorization: 5,
        });
      } catch (error) {
        warn("appsflyer-sdk", "Could not initialize Appsflyer SDK: ", JSON.stringify(error));
      }
    }

    requestTrackingPermission();
    initializeSdk();
  }, []);
}
