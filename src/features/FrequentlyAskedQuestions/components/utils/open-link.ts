import { Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";

import { warn } from "@/logger";

export default async function openLink(url: string, inAppBrowserBackgroundColor: string, inAppBrowserColor: string) {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: "done",
        preferredBarTintColor: inAppBrowserBackgroundColor,
        preferredControlTintColor: inAppBrowserColor,
        readerMode: false,
        animated: true,
        modalPresentationStyle: "fullScreen",
        modalTransitionStyle: "coverVertical",
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: inAppBrowserBackgroundColor,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    warn("frequently-asked-questions", "Could not open link: ", JSON.stringify(error));
  }
}
