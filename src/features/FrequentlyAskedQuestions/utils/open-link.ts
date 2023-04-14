import { NavigationProp } from "@react-navigation/native";
import { Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";

import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";

function extractFaqIdFromUrl(url: string) {
  const faqIdMatch = url.match(RegExp("croatia:\\/\\/app\\/faq\\/(.*)"));
  return faqIdMatch !== null && typeof faqIdMatch[1] === "string" ? faqIdMatch[1] : undefined;
}

export default async function openLink(
  url: string,
  inAppBrowserBackgroundColor: string,
  inAppBrowserColor: string,
  navigation: NavigationProp<MainStackParams>
) {
  try {
    // Check if link directly links to a FAQ
    const faqIdMatch = extractFaqIdFromUrl(url);
    if (faqIdMatch !== undefined) {
      navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", {
        faqId: faqIdMatch,
      });
    } else if (await InAppBrowser.isAvailable()) {
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
