import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, I18nManager } from "react-native";

import { setOverrideLanguage } from "./language-selector";
import reloadApp from "./reload-app";

export default function useChangeLanguage() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const informUserAboutReload = () => {
      Alert.alert(t("Settings.reloadAppMessage"), undefined, [
        {
          text: t("Settings.okButtonMessage"),
          onPress: () => reloadApp(),
          style: "destructive",
        },
      ]);
    };

    const handleOnLanguageChange = () => {
      const prevIsRTL = I18nManager.isRTL;
      const nextIsRTL = i18n.dir() === "rtl";

      if (prevIsRTL !== nextIsRTL) {
        I18nManager.allowRTL(nextIsRTL);
        informUserAboutReload();
      }
    };

    i18n.on("languageChanged", handleOnLanguageChange);

    return () => i18n.off("languageChanged", handleOnLanguageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return async function handleOnChange(language: string) {
    i18n.changeLanguage(language);
    await setOverrideLanguage(language);
  };
}
