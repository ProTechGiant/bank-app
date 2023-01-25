import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

export const resources = {
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
      Home: {
        DashboardScreen: {
          AccountInfoHeader: {
            IBANCopied: "IBAN copied",
          },
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
        SetPinAndAddressScreen: {
          navTitle: "Order Card",
          SetPin: {
            title: "Set PIN",
            intro: "Enter 4 unique numbers",
            avoidSimplePin: "Avoid a PIN that’s easy to guess, like 1234 or 1111.",
            alert: {
              title: "Easy PIN",
              content: "Avoid a PIN with simple number sequences and repeated numbers",
              button: "Change it",
            },
          },
          ConfirmPin: {
            title: "Confirm PIN",
            intro: "Re-enter your 4 numbers",
            pinNotMatch: "Your PINs didn’t match, please try again. {{count}} try remaining.",
            pinNotMatch_plural: "Your PINs didn’t match, please try again. {{count}} tries remaining.",
            tooManyTries: "Oops! Too many tries",
            button: "Set New PIN",
          },
          CardDeliveryDetails: {
            title: "Card delivery details",
            paragraph: {
              default: "Your card will be sent here:",
              checkHighlighted: "Check the correct delivery address is highlighted:",
            },
            buttons: {
              confirm: "Confirm and continue",
              edit: "Edit temporary address",
              setAddress: "Set temporary address",
            },
            error: {
              title: "We’re sorry, something has gone wrong.",
              message: "Please try again later or contact Customer Care.",
            },
          },
        },
        SetTemporaryAddressScreen: {
          navTitle: "Delivery Address",
          form: {
            addressLineOne: {
              label: "Address line 1",
              placeholder: "Address line 1",
              validation: {
                required: "Address line 1 is required",
                notValid: "Address line 1 is not valid",
                minLength: "Minimum 5 characters",
              },
            },
            addressLineTwo: {
              label: "Address line 2",
              placeholder: "Address line 2",
            },
            district: {
              label: "District",
              placeholder: "District",
              validation: {
                required: "District is required",
              },
            },
            city: {
              label: "City",
              placeholder: "Select your city",
              dropdownHeader: "Select city",
              validation: {
                required: "City is required",
              },
            },
            postalCode: {
              label: "Postal Code",
              placeholder: "Postal Code",
              validation: {
                required: "Postal code is required",
                minLength: "Postal code is not valid",
              },
            },
            button: "Confirm and continue",
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
        AddToAppleWalletScreen: {
          title: "Add to Apple Wallet",
          paragraph: "Make payments using Croatia on your Apple devices.",
          buttons: {
            addToWallet: "Add to Apple Wallet",
            skip: "Skip",
          },
        },
        ApplePayActivatedScreen: {
          title: "Apple Pay activated",
          button: "Finish",
        },
      },
      Referral: {
        share: "Share",
        read: "Read more in ",
        termsAndConditions: "Terms & Conditions",
        HubScreen: {
          title: "Share Croatia",
          subtitle: "Send your referral code and track your rewards",
          recommendations: "your recommendations",
          copy: "Copy code",
          progress: "In progress",
          completed: "Completed",
          earnt: "Earnt so far",
          howItWorks: "How it works",
        },
        HowItWorksModal: {
          title: "How recommending for rewards works",
          stepOne: "Share your referral code",
          stepTwo: "Sign up and use your account in 30 days (T&Cs apply)",
          stepThree: "You and your friend receive a cash reward",
          rewardTitle: "How much will we get?",
          rewardSubtext:
            "You’ll both earn 15 SAR. If your friend joins as a Plus Tier customer their reward goes up to 25 SAR.",
          buttonText: "Start recommending",
        },
        InstructionsScreen: {
          skip: "Skip",
          continue: "Continue",
          1: {
            title: "Recommend for rewards",
            subText: "Tell a friend or family member about Croatia and earn yourself cash rewards.",
          },
          2: {
            title: "Unlimited referrals",
            subText:
              "Share your referral code to as many people as you like. You’ll earn cash rewards when they start using the app.",
          },
          3: {
            title: "Both of you get rewards",
            subText:
              "You'll both earn 15 SAR. And if your friend joins our Plus Tier, they’ll get an increase to 25 SAR.",
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
      InstructionsScreen: {
        skip: "تخطى",
        continue: "متابعة",
        1: {
          title: "علّمهم عن 'يمدي' وحنا نكافئك",
          subText: "عرّف أصدقائك وعائلتك على 'يمدي' واحصل على مكافأة كاش بحسابك.",
        },
        2: {
          title: "الدعوة مفتوحة",
          subText: "شارك كود الدعوة مع كل إللي تعرفهم وراح نكافئك بكاش من أول لحظة يستخدمون فيها للتطبيق.",
        },
        3: {
          title: "المكافأة للطرفين",
          subText:
            "مرسل ومُستقبِل الدعوة راح يحصلون على مكافأة 15 ريال سعودي. وعملاء فئة بلس 25 ريال سعودي عن كل دعوة.",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  debug: __DEV__,
  fallbackLng: "en",
  lng: I18nManager.isRTL ? "ar" : "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
  returnNull: false,
  resources,
});

export default i18n;
