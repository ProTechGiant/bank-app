import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AppState, AppStateStatus, NativeModules, Platform } from "react-native";

import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

function getDeviceLanguage() {
  const deviceLanguage =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLanguages[0] || NativeModules.SettingsManager.settings.AppleLocale // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage === "ar-SA" ? "ar" : "en";
}

export default function useDeviceLanguage() {
  const { i18n } = useTranslation();
  const prevState = useRef<AppStateStatus>();

  useEffect(() => {
    prevState.current = AppState.currentState;

    const listener = AppState.addEventListener("change", async state => {
      const savedAppLanguage = await getItemFromEncryptedStorage("userSwitchedAppLanguage");

      if (state === "active" && prevState.current !== state) {
        const newLanguage = getDeviceLanguage();

        if (!savedAppLanguage && i18n.language !== newLanguage) {
          i18n.changeLanguage(newLanguage);
        }
      }

      prevState.current = state;
    });

    return () => listener.remove();
  });
}
