import queryString from "query-string";
import { EmitterSubscription, Linking } from "react-native";

import { warn } from "@/logger";
import Navigation from "@/navigation/NavigationService";
import {
  getItemFromEncryptedStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

type DeepLinkData = {
  url: string;
};

class DeepLinkService {
  private isAuthenticated = false;
  private listener: EmitterSubscription | null = null;

  private deepLink: DeepLinkData = {
    url: "",
  };

  init(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  navigate(stack: string, screenName: string, extraData: object | undefined) {
    Navigation?.navigate(stack, screenName, extraData);
  }

  async handleGoToLink() {
    try {
      const [navigationData, params] = this.deepLink.url.replace("goto/", "").split("?");
      const [stackName, screenName] = navigationData.split("/");

      const allParams = queryString.parse(params);

      if (screenName) {
        if (!this.isAuthenticated) {
          setItemInEncryptedStorage("PUSH_NOTIFICATION_CONTENT", this.deepLink.url);
          Navigation?.navigate("SignIn.SignInStack");
        } else {
          this.resetAndNavigate(stackName, screenName, allParams);
        }
      }
    } catch (e) {
      warn("go to link error", JSON.stringify(e));
    }
  }

  resetDeepLinkUrl() {
    removeItemFromEncryptedStorage("PUSH_NOTIFICATION_CONTENT");
    this.deepLink.url = "";
  }

  resetAndNavigate(stackName: string, screenName: string, params?: object) {
    this.resetDeepLinkUrl();
    this.navigate(stackName, screenName, params);
  }

  processDeepLink() {
    //will handle goto links as internal links here
    if (this.deepLink.url.includes("goto")) {
      this.handleGoToLink();
      return;
    } else {
      //handle external links here
    }
  }

  setAndExecuteDeepLink(payload: DeepLinkData) {
    this.deepLink = payload;
    this.processDeepLink();
  }

  handleDeepLink = (url: string | null, isAuthenticated?: boolean) => {
    removeItemFromEncryptedStorage("COMING_FROM_TPP");

    // TODO this to handle coming from tpp service
    if (url === "croatia://app/tpp") {
      setItemInEncryptedStorage("COMING_FROM_TPP", "true");
    }
    if (url) {
      const deepLink = {
        url,
      };
      this.init(isAuthenticated || this.isAuthenticated);
      this.setAndExecuteDeepLink(deepLink);
    }
  };

  async onAuthenticationStateChanged(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
    const deepLink = await getItemFromEncryptedStorage("PUSH_NOTIFICATION_CONTENT");
    if (deepLink) {
      this.handleDeepLink(deepLink);
    }
  }

  handleDeepLinkEvent(event: { url: string }) {
    const { url } = event;
    this.handleDeepLink(url);
  }

  startListening() {
    Linking.getInitialURL().then(this.handleDeepLink);

    this.listener = Linking.addEventListener("url", this.handleDeepLinkEvent);
  }

  stopListening = () => {
    this.listener = null;
  };
}

const deepLinkService = new DeepLinkService();
export default deepLinkService;
