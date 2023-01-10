import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  debug: __DEV__,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
  resources: {
    en: {
      translation: {
        Onboarding: {
          SplashScreen: {
            title: "You're in control now",
            subTitle: "Sub title",
            buttons: {
              signUp: "Sign up",
              signIn: "Sign in",
            },
          },
        },
      },
    },
    ar: {
      translation: {
        Onboarding: {
          SplashScreen: {
            title: "أنت الآن في السيطرة",
            subTitle: "مرحبًا",
            buttons: {
              signUp: "أنشئ حساب",
              signIn: "تسجيل الدخول",
            },
          },
        },
      },
    },
  },
});

export default i18n;
