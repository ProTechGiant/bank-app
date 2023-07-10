import { NativeModules, Platform } from "react-native";

import { warn } from "@/logger";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export function getDeviceLanguage() {
  const deviceLanguage: string =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLanguages[0] ?? NativeModules.SettingsManager.settings.AppleLocale // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage.startsWith("ar") ? "ar" : "en";
}

export function setOverrideLanguage(language: string) {
  return setItemInEncryptedStorage("overrideLanguage", language);
}

export function getOverrideLanguage() {
  return getItemFromEncryptedStorage("overrideLanguage");
}

export default async function getSelectedLanguage() {
  const deviceLanguage = getDeviceLanguage();

  try {
    const overrideLanguage = await getOverrideLanguage();

    return overrideLanguage ?? deviceLanguage;
  } catch (error) {
    warn("language-selector", "Could not fetch language from storage", JSON.stringify(error));
    return deviceLanguage;
  }
}
