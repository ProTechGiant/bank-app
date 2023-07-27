import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AppState, AppStateStatus } from "react-native";

import { getDeviceLanguage, getOverrideLanguage } from "./language-selector";
import useChangeLanguage from "./use-change-language";

export default function useDeviceLanguage() {
  const { i18n } = useTranslation();
  const prevState = useRef<AppStateStatus>(AppState.currentState);
  const { handleOnChange } = useChangeLanguage();

  useEffect(() => {
    const listener = AppState.addEventListener("change", async state => {
      if (state !== "active" || state === prevState.current) {
        return; // app not in foreground
      }

      const deviceLanguage = getDeviceLanguage();
      const hasOverrideLanguage = (await getOverrideLanguage()) !== null;

      if (i18n.language === deviceLanguage || hasOverrideLanguage) {
        return; // language did not change OR we user has custom language selected
      }

      handleOnChange(deviceLanguage);

      prevState.current = state;
    });

    return () => listener.remove();
  });
}
