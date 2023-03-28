import { APPSFLYER_DEV_KEY, APPSFLYER_IOS_APP_KEY } from "@env";
import { useEffect } from "react";
import appsFlyer from "react-native-appsflyer";
import { getTrackingStatus, requestTrackingPermission } from "react-native-tracking-transparency";

import version from "@/version";

export default function useAppsflyer() {
  useEffect(() => {
    const trackingStatus = async () => {
      const status = await getTrackingStatus();
      if (status !== "authorized" && status !== "unavailable") {
        await requestTrackingPermission();
      }
    };
    trackingStatus();
    // User clicks the OneLink short URL.
    // The iOS Universal Links/ Android App Links (for deep linking) or the deferred deep link, trigger the SDK.
    // The SDK triggers the onDeepLink listener, and passes the deep link result object to the user.
    // The onDeepLink listener uses the deep link result object that includes the deep_link_value and other parameters to create the personalized experience for the users, which is the main goal of OneLink.
    appsFlyer.onDeepLink(res => {
      console.log("onDeepLink: ", JSON.stringify(res));
      if (res?.deepLinkStatus !== "NOT_FOUND" && res?.data?.referralCode) {
        // @TODO implement logic here for checking referral code
      }
    });

    appsFlyer.setAppInviteOneLinkID("vtqe");

    appsFlyer.initSdk({
      devKey: APPSFLYER_DEV_KEY,
      isDebug: __DEV__ || ["test", "eit"].includes(version.buildType),
      appId: APPSFLYER_IOS_APP_KEY,
      onInstallConversionDataListener: true,
      onDeepLinkListener: true,
      timeToWaitForATTUserAuthorization: 30,
    });
  }, []);
}
