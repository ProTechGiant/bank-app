import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arTranslation from "./ar.json";
import enTranslation from "./en.json";

export const resources = {
  en: {
    translation: enTranslation,
  },

  ar: {
    translation: arTranslation,
  },
};

export function initializeI18n(language: string) {
  i18n.use(initReactI18next).init({
    debug: __DEV__,
    fallbackLng: "en",
    lng: language,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v4",
    returnNull: false,
    resources,
  });

  return i18n;
}

export { default as getSelectedLanguage } from "./language-selector";
export { default as useChangeLanguage } from "./use-change-language";
export { default as useDeviceLanguage } from "./use-device-language";
