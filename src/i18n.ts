import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  debug: __DEV__,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
  returnNull: false,
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
          IqamaInputScreen: {
            navHeaderTitle: "SIGN UP",
            title: "Let's go",
            subTitle: "Let’s start with your contact and ID details:",
            mobileLabel: "Mobile",
            mobilePlaceholder: "Enter Mobile",
            iqamaLabel: "National ID/Iqama",
            iqamaPlaceholder: "Enter your national ID/Iqama",
            notificationText: {
              one: "To join Croatia, you must be over 18 and have an Absher profile. Register at ",
              two: "absher.sa",
              three: " before joining us.",
            },
            continue: "Continue",
            subtext: "Already with us? ",
            signIn: "Sign in",
          },
          NafathAuthScreen: {
            navHeaderTitle: "AUTHENTICATION",
            modalLink: "Open Nafath App",
            modalLoad: "Loading...",
            modalBody: "Make a note of this number as you will be asked for it shortly",
            title: "Authentication by Nafath",
            appButtonTitle: "Nafath app ",
            appButtonSubtitle: "Your fastest experience",
            appButtonBody: "Select this option for a quick ID authentication",
            siteButtonTitle: "Nafath site",
            siteButtonBody: "You will be taken from this app to the Nafath site",
            dropdownTitle: "Why do I have to use Nafath?",
            dropdownBody: "Nafath enables Croatia to verify your identity",
          },
        },
        Settings: {
          SettingsScreen: {
            rewards: "Refer For Rewards",
            FAQs: "FAQ’s",
          },
        },
        ApplyCards: {
          ApplyForCardScreen: {
            navTitle: "Order Card",
            tabs: {
              standard: "Standard",
              lux: "Lux",
            },
            standard: {
              button: "Get Standard Card for FREE",
            },
            lux: {
              remarks: "Lux is FREE when you upgrade to Croatia Plus",
              button: "Get Lux Card with Croatia Plus",
            },
          },
          CreateCardPinScreen: {
            navTitle: "Order Card",
            setPin: {
              title: "Set PIN",
              intro: "Enter 4 unique numbers",
              avoidSimplePin: "Avoid a PIN that’s easy to guess, like 1234 or 1111.",
              alert: {
                title: "Easy PIN",
                content: "Avoid a PIN with simple number sequences and repeated numbers",
                button: "Change it",
              },
            },
            confirmPin: {
              title: "Confirm PIN",
              intro: "Re-enter your 4 numbers",
              pinNotMatch: "Your PINs didn’t match, please try again. {{count}} try remaining.",
              pinNotMatch_plural: "Your PINs didn’t match, please try again. {{count}} tries remaining.",
              tooManyTries: "Oops! Too many tries",
              button: "Set New PIN",
            },
          },
          SetTemporaryAddressScreen: {
            navTitle: "Set Temporary Address",
            title: "Enter Temporary Address",
            form: {
              addressLineOne: {
                label: "Address line 1",
                placeholder: "Address line 1",
              },
              addressLineTwo: {
                label: "Address line 2",
                placeholder: "Address line 2",
              },
              district: {
                label: "Address line 2",
                placeholder: "Address line 2",
              },
              city: {
                label: "City",
                placeholder: "Select your city",
              },
              postalCode: {
                label: "Postal Code",
                placeholder: "Postal Code",
              },
              button: "Confirm",
            },
          },
          CardDeliveryDetailsScreen: {
            navTitle: "Order Card",
            title: "Card delivery details",
            paragraph: "Your card will be sent here:",
            buttons: {
              confirm: "Confirm and continue",
              edit: "Edit Temporary Address",
              setAddress: "Set Temporary Address",
            },
            error: {
              title: "We’re sorry, something has gone wrong.(((",
              message: "Please try again later or contact Customer Care.",
            },
          },
          CardOrderedScreen: {
            title: "Card ordered",
            paragraph: "Your card will be with you by",
            buttons: {
              addToWallet: "Add to Wallet",
              finish: "Finish",
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
          IqamaInputScreen: {
            navHeaderTitle: "إنشاء حساب",
            title: "لننطلق",
            subTitle: "لنبدأ بتفاصيل الهوية الشخصية وبيانات التواصل:",
            mobileLabel: "الجوال",
            mobilePlaceholder: "Enter Mobile",
            iqamaLabel: "رقم هوية/الإقامة",
            iqamaPlaceholder: "قم بإدخال رقم الهوية الوطنية/الإقامة",
            notificationText: {
              one: " للانضمام إلى 'يمدي' يجب أن يتجاوز عمرك 18 عام ولديك حساب 'أبشر'. قبل الانضمام إلينا، يُمكنك التسجيل على ",
              two: "absher.sa",
              three: "",
            },
            continue: "Continue",
            subtext: "Already with us? ",
            signIn: "تسجيل الدخول",
          },
          NafathAuthScreen: {
            navHeaderTitle: "AUTHENTICATION",
            modalLink: "افتح تطبيق 'نفاذ'",
            modalLoad: "Loading...",
            modalBody: "تذكرهذا الرقم لأنك ستحتاجه بعملية التوثيق بعد قليل.",
            title: "Authentication by Nafath",
            appButtonTitle: "Nafath app ",
            appButtonSubtitle: "Your fastest experience",
            appButtonBody: "Select this option for a quick ID authentication",
            siteButtonTitle: "Nafath site",
            siteButtonBody: "You will be taken from this app to the Nafath site",
            dropdownTitle: "Why do I have to use Nafath?",
            dropdownBody: "Nafath enables Croatia to verify your identity",
          },
        },
      },
    },
  },
});

export default i18n;
