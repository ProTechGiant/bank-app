import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager } from "react-native";

import reloadApp from "./reload-app";

export default function useI18nDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const informUserAboutReload = () => {
      Alert.alert("We must restart the app to continue", undefined, [
        {
          text: "OK",
          onPress: () => reloadApp(),
          style: "destructive",
        },
      ]);
    };

    const handleOnLanguageChange = () => {
      const prevIsRTL = I18nManager.isRTL;
      const nextIsRTL = i18n.dir() === "rtl";

      if (prevIsRTL !== nextIsRTL) {
        I18nManager.forceRTL(nextIsRTL);
        informUserAboutReload();
      }
    };

    i18n.on("languageChanged", handleOnLanguageChange);

    return () => i18n.off("languageChanged", handleOnLanguageChange);
  }, []);
}
