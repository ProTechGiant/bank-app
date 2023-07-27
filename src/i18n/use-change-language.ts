import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";

import { setOverrideLanguage } from "./language-selector";

export default function useChangeLanguage() {
  const { i18n } = useTranslation();

  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);

  useEffect(() => {
    const informUserAboutReload = () => {
      handleShowRestartModal();
    };

    const handleOnLanguageChange = () => {
      const prevIsRTL = I18nManager.isRTL;
      const nextIsRTL = i18n.dir() === "rtl";

      if (prevIsRTL !== nextIsRTL) {
        // we need to update `allowRTL` because otherwise the app may still use the incorrect layout direction
        // if the device is using RTL but we want LTR instead
        // see https://github.com/facebook/react-native/blob/main/packages/react-native/React/Modules/RCTI18nUtil.m#L37C13-L37C25
        I18nManager.allowRTL(nextIsRTL);
        I18nManager.forceRTL(nextIsRTL);

        informUserAboutReload();
      }
    };

    i18n.on("languageChanged", handleOnLanguageChange);

    return () => i18n.off("languageChanged", handleOnLanguageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowRestartModal = () => {
    setIsRestartModalVisible(true);
  };

  const handleHideRestartModal = () => {
    setIsRestartModalVisible(false);
  };

  const handleOnChange = async (language: string) => {
    await setOverrideLanguage(language);
    i18n.changeLanguage(language);
  };

  return {
    isRestartModalVisible,
    handleShowRestartModal,
    handleHideRestartModal,
    handleOnChange,
  };
}
