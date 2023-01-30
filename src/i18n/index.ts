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
          errorText: {
            twoAttemptsLeft: "You have tried to sign up 3 times. You have 2 attempts remaining.",
            oneAttemptsLeft: "You have tried to sign up 4 times. You have 1 attempts remaining.",
            noAttemptsLeft: "You have tried 5 times to sign up.\n\n Please wait until tomorrow before retrying.",
            noMatch: "The mobile number and ID given aren’t linked to an Absher profile",
            cannotOpen: "You cannot open an account this time",
            regulatoryCheck: "Due to a regulatory check we can’t open an account for you right now",
            hasAccount: {
              warning: "You’ve already joined Croatia,",
              signin: "sign in now",
            },
          },
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
        ConfirmPersonalDetailsScreen: {
          navHeaderTitle: "CONFIRM",
          title: "Confirm your personal details",
          infoLineName: "Full name",
          infoLineNationality: "Nationality",
          infoLineExpiry: "ID/Iqama expiry",
          infoLineAddress: "KSA Address",
          moreInfoDropdownTitle: "I need to change my details",
          moreInfoDropdownBodyOne: "Visit ",
          moreInfoDropdownBodyTwo: "absher.sa ",
          moreInfoDropdownBodyThree:
            "to change your details. Please restart the process when your Absher profile has been updated. This can take up to 72 hours.",
          CheckBoxLabel: "I confirm my details are correct",
          Continue: "Continue",
        },
        OptionalEmailScreen: {
          navHeaderTitle: "EMAIL",
          title: "Stay updated",
          subHeader: "Share your email and we’ll keep you up to date with what’s new.",
          inputEmailLabel: "Email",
          inputEmailPlaceholder: "Your address",
          continue: "Continue",
          skip: "Skip",
          errorText: {
            alert: "Woops. Could not confirm your personal details",
          },
        },
        FinancialInformationScreen: {
          navHeaderTitle: "ABOUT YOU",
          title: "Your income and spending",
          inputOccupationLabel: "What's your occupation",
          inputOccupationPlaceholder: "Select your occupation",
          inputOccupationExtra: "If you registered an occupation on Absher it may show here, however you can change it",
          inputAccountPurposeLabel: "How will you use Croatia?",
          inputAccountPurposePlaceholder: "Select at least one option",
          inputSourceOfIncomeLabel: "What's your main source of income",
          inputSourceOfIncomePlaceholder: "Select at least one option",
          inputMonthlyLimitLabel: "After bills and expenses, how much do you have left to spend each month?",
          inputMonthlyLimitPlaceholder: "Select an amount",
          moreInfoDropdownTitle: "Why we need this information",
          moreInfoDropdownBody:
            "This information is used to complete validation checks as part of joining Croatia. If anything here changes you’ll be able to update it in the app.",
          continue: "Save and continue",
          inputValidation: {
            accountPurpose: "Intended use of Croatia Required",
            sourceOfIncome: "Source of income required",
            monthlyLimit: "Expected amount required",
          },
          errorText: {
            alert: "Woops. Could not submit financial details",
          },
        },
        ForeignTaxScreen: {
          navHeaderTitle: "ABOUT YOU",
          title: "Your tax residency details",
          subHeader: "Are you a tax resident in any countries outside Saudi Arabia?",
          yes: "Yes",
          no: "No",
          moreInfoDropdownTitle: "What is a tax residency?",
          moreInfoDropdownBody:
            "A tax residence is any country where you are legally required to pay taxes. Once a year we’ll ask you to check this information.",
          continue: "Continue",
          addCountry: "Add country",
          addCountryExtra: "You can add 3 in total",
          countryModals: {
            countryLabel: "Add Country:",
            countryPlaceholder: "Select your country",
            taxNumberLabel: "Your Unique Taxpayer Reference (UTR):",
            taxNumberPlaceholder: "0000 0000 0000 0000",
            addButton: "Add",
            continue: "Continue",
            remove: "Remove country",
            countryListTitle: "Add country",
            errorText: "Please check your UTR has no special characters",
          },
          InfoBoxCountryTitle: "Country ",
          InfoBoxReferenceTitle: "Unique",
          maxCountriesText: "You’ve reached the maximum amount countries",
        },
        TermsAndConditions: {
          navHeaderTitle: "TERMS",
          title: "Terms of signup",
          checkBoxTermsLabel: "I agree to the Terms and Conditions",
          checkBoxDeclarationLabel: "I agree to the Customer Declaration",
          continue: "Continue",
        },
      },
      Settings: {
        SettingsScreen: {
          rewards: "Invite friends",
          FAQs: "FAQ’s",
        },
      },
      Home: {
        DashboardScreen: {
          AccountInfoHeader: {
            IBANCopied: "IBAN copied",
            balanceHidden: "Balance hidden",
            hideBalance: "Hide balance",
            showBalance: "Show balance",
            myAccount: "My account",
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
      SavingsGoals: {
        LandingScreen: {
          title: "Achieve your Savings Goals",
          paragraphOne: "Got a dream but it requires a little saving? We’ve got you.",
          paragraphTwo: "Croatia makes it simple to set aside what you need, to get what you want.",
          button: "What’s your goal?",
        },
        SavingsGoalsScreen: {
          navTitle: "Savings Goals",
          title: "What do you want to save for?",
        },
        CreateGoalModal: {
          navTitle: "Create goal",
          button: "Continue",
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
          continue: "استمرار",
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
        ConfirmPersonalDetailsScreen: {
          navHeaderTitle: "CONFIRM",
          title: "Confirm your personal details",
          infoLineName: "Full name",
          infoLineNationality: "Nationality",
          infoLineExpiry: "ID/Iqama expiry",
          infoLineAddress: "KSA Address",
          moreInfoDropdownTitle: "I need to change my details",
          moreInfoDropdownBodyOne: "Visit ",
          moreInfoDropdownBodyTwo: "absher.sa ",
          moreInfoDropdownBodyThree:
            "to change your details. Please restart the process when your Absher profile has been updated. This can take up to 72 hours.",
          CheckBoxLabel: "I confirm my details are correct",
          Continue: "استمرار",
        },
        OptionalEmailScreen: {
          navHeaderTitle: "EMAIL",
          title: "Stay updated",
          subHeader: "Share your email and we’ll keep you up to date with what’s new.",
          inputEmailLabel: "Email",
          inputEmailPlaceholder: "Your address",
          continue: "استمرار",
          skip: "Skip",
          errorText: {
            alert: "Woops. Could not confirm your personal details",
          },
        },
        FinancialInformationScreen: {
          navHeaderTitle: "بيانات المُستخدم",
          title: "Your income and spending",
          inputOccupationLabel: "What's your occupation",
          inputOccupationPlaceholder: "Select your occupation",
          inputOccupationExtra: "If you registered an occupation on Absher it may show here, however you can change it",
          inputAccountPurposeLabel: "How will you use Croatia?",
          inputAccountPurposePlaceholder: "Select at least one option",
          inputSourceOfIncomeLabel: "What's your main source of income",
          inputSourceOfIncomePlaceholder: "Select at least one option",
          inputMonthlyLimitLabel: "After bills and expenses, how much do you have left to spend each month?",
          inputMonthlyLimitPlaceholder: "Select an amount",
          moreInfoDropdownTitle: "Why we need this information",
          moreInfoDropdownBody:
            "This information is used to complete validation checks as part of joining Croatia. If anything here changes you’ll be able to update it in the app.",
          continue: "Save and continue",
          inputValidation: {
            accountPurpose: "Intended use of Croatia Required",
            sourceOfIncome: "Source of income required",
            monthlyLimit: "Expected amount required",
          },
          errorText: {
            alert: "Woops. Could not submit financial details",
          },
        },
        ForeignTaxScreen: {
          navHeaderTitle: "بيانات المُستخدم",
          title: "تفاصيل ضريبة الإقامة خارج المملكة",
          subHeader: "هل يترتب عليك ضريبة إقامة بأي بلد خارج المملكة العربية السعودية؟",
          yes: "نعم",
          no: "لا",
          moreInfoDropdownTitle: "ما هي ضريبة الإقامة خارج المملكة؟",
          moreInfoDropdownBody:
            "ضريبة الإقامة وهي أي بلد يطلب منك فيه قانوناً دفع الضرائب لحصولك على إقامة فيه. نحتاج إلى معلومات (إن وجدت) عن ضريبة الإقامة خارج المملكة العربية السعودية. يرجى ملاحظة: سوف تحتاج إلى تحديث هذه البيانات سنوياً.",
          continue: "استمرار",
          addCountry: "Add country",
          addCountryExtra: "You can add 3 in total",
          countryModals: {
            countryLabel: "ما هي البلد بالتحديد؟",
            countryPlaceholder: "اختر بلدك من القائمة",
            taxNumberLabel: "الرقم الضريبي",
            taxNumberPlaceholder: "0000 0000 0000 0000",
            addButton: "Add",
            continue: "استمرار",
            remove: "Remove country",
            countryListTitle: "Add country",
            errorText: "يرجى التأكد من الرقم الضريبي",
          },
          InfoBoxCountryTitle: "Country ",
          InfoBoxReferenceTitle: "Unique",
          maxCountriesText: "You’ve reached the maximum amount countries",
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
