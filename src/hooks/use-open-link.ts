import { NavigationProp } from "@react-navigation/native";
import queryString from "query-string";
import { Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";

import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import useNavigation from "../navigation/use-navigation";

type parsedUri = {
  page: string;
  restPath?: string;
  query?: queryString.ParsedQuery<string>;
};

function isValidInternalUri(url: string) {
  return url.includes("croatia://");
}

function parseInternalUri(url: string): parsedUri {
  const result = queryString.parseUrl(url);
  const [page, restPath] = result.url.replace("croatia://", "").split("/");

  return { page, restPath, query: result.query };
}

function handleInternalUri(parsedUri: parsedUri, navigation: NavigationProp<AuthenticatedStackParams>) {
  switch (parsedUri.page) {
    case "faqs":
      if (parsedUri.restPath === undefined) break;
      navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack", {
        screen: "FrequentlyAskedQuestions.DetailedScreen",
        params: { faqId: parsedUri.restPath },
      });
      break;
    case "whats-next":
      if (parsedUri.restPath === undefined) break;
      navigation.navigate("WhatsNext.WhatsNextStack", {
        screen: "WhatsNext.ExploreArticleScreen",
        params: { articleId: parsedUri.restPath },
      });
      break;
  }
}

export default function useOpenLink() {
  const navigation = useNavigation();
  const inAppBrowserBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const inAppBrowserColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return async function (url: string) {
    try {
      if (isValidInternalUri(url)) {
        const parsedUri = parseInternalUri(url);
        if (parsedUri.page.length > 0) {
          handleInternalUri(parsedUri, navigation);
        } else {
          warn("open-link", "Received internal Uri but Uri doesn't contain valid page");
        }
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
      warn("open-url", "Could not open link: ", JSON.stringify(error));
    }
  };
}
