import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

export const resources = {
  en: {
    translation: {
      DayPicker: {
        currentlyOnDay_one: "On {{count}}st",
        currentlyOnDay_two: "On {{count}}nd",
        currentlyOnDay_few: "On {{count}}rd",
        currentlyOnDay_other: "On {{count}}th",
      },
      errors: {
        generic: {
          title: "We’re sorry, something has gone wrong.",
          message: "Please try again later or contact Customer Care.",
        },
      },
      Onboarding: {
        SplashScreen: {
          title: "You're in control now",
          subTitle: "Sub title",
          buttons: {
            signUp: "Sign up",
            signIn: "Sign in",
          },
        },
        LandingScreen: {
          success: {
            title: "You're on your way",
            bannerMessage: "Your account was successfully created!",
          },
          failed: {
            title: "Unfortunately, we can’t create an account for you",
            subtitle: "If you have any concerns, please contact XXXXXXX.",
          },
          pending: {
            title: "You're on your way",
            bannerMessage:
              "It can take up to X days for us to finalise this process. An SMS will be sent to you when your account has been created.",
          },
          buttons: {
            FinishLater: "Finish Later",
          },
        },
        IqamaInputScreen: {
          errorText: {
            twoAttemptsLeft: "You have tried to sign up 3 times. You have 2 attempts remaining.",
            oneAttemptsLeft: "You have tried to sign up 4 times. You have 1 attempts remaining.",
            noAttemptsLeft: "You have tried 5 times to sign up.\n\n Please wait until tomorrow before retrying.",
            noMatch: "The mobile number and ID given aren’t linked to an Absher profile",
            cannotOpen: "You cannot open an account this time",
            regulatoryCheck: "Due to a regulatory check we can’t open an account for you right now ",
            hasAccount: {
              warning: "You’ve already joined Croatia,",
              signin: "sign in now",
            },
          },
          navHeaderTitle: "SIGN UP",
          title: "Let's go",
          subTitle: "Let’s start with your contact and ID details:",
          mobileLabel: "Mobile",
          mobilePlaceholder: "Enter mobile",
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
          inputSetLabel: "Set",
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
        FatcaDetailsScreen: {
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
          CountrySelector: {
            navHeaderTitle: "Add tax residency",
            countryLabel: "Select country:",
            countryPlaceholder: "Select your country",
            taxNumberLabel: "Unique Taxpayer Reference (UTR):",
            taxNumberPlaceholder: "0000 0000 0000 0000",
            addButton: "Add",
            dropDownLabel: "Select country",
            setButton: "Set",
            updateButton: "Update",
            removeButton: "Remove country",
            countryListTitle: "Add country",
            errorText: {
              countryRequired: "Country required",
              taxNumberRequired: "UTR required",
              taxNumberInvalid: "Please check your UTR is letters and numbers only",
            },
          },
          InfoBoxCountryTitle: "Country ",
          InfoBoxReferenceTitle: "Unique Reference",
          maxCountriesText: "You’ve reached the maximum amount countries",
        },
        TermsAndConditions: {
          navHeaderTitle: "TERMS",
          title: "Terms of signup",
          checkBoxTermsLabel: "I agree to the Terms and Conditions",
          checkBoxDeclarationLabel: "I agree to the Customer Declaration",
          continue: "Continue",
          terms: {
            sectionOne: {
              title: "Summary heading 1",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
            sectionTwo: {
              title: "Summary heading 2",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
            sectionThree: {
              title: "Summary heading 3",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
          },
          declarations: {
            sectionOne: {
              title: "Introduction",
              bodyOne: "The Terms and Conditions shall manage your use of our lifestyle offering, Croatia.",
              bodyTwo:
                "These Terms will be applied fully and affect to your use of Croatia. By using Croatia, you agreed to accept all terms and conditions written in here. You must not use Croatia if you disagree with any of these Standard Terms and Conditions.",
              bodyThree:
                "Minors or people below 18 years old are not allowed to open any banking products with Croatia.",
            },
            sectionTwo: {
              title: "Intellectual Property Rights",
              bodyOne:
                "Other than the content you own, Croatia and/or its licensors own all the intellectual property rights and materials contained in this Website.",
              bodyTwo:
                "You are granted limited license only for purposes of viewing the material contained on this Website.",
              bodyThree: "",
            },
          },
          errorText: {
            alert: "Woops. Could not confirm T&Cs",
          },
        },
      },
      Settings: {
        SettingsScreen: {
          rewards: "Send invite",
          FAQs: "FAQ’s",
          notifications: "Notifications",
        },
      },
      Home: {
        DashboardScreen: {
          editDashBoard: "EDIT DASHBOARD",
          quickActions: "Quick actions",
          rewards: "Rewards",
          whatsNext: "What's next",
          edit: "Edit",
          seeAll: "See all",
          AccountInfoHeader: {
            IBANCopied: "IBAN copied",
            balanceHidden: "Balance hidden",
            hideBalance: "Hide balance",
            showBalance: "Show balance",
            myAccount: "My account",
          },
        },
        HomepageReorderModal: {
          cancel: "CANCEL",
          editActions: "Edit Actions",
          save: "SAVE",
          selectFavourite: "Select your favorite sections to always be accessible on Home.",
        },
        QuickActionsReorderCard: {
          cancel: "CANCEL",
          editActions: "Edit Actions",
          save: "SAVE",
          selectThreeFavourites: "Select 3 of your favorite actions to always be accessible on Home.",
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
            instruction: "Enter 4 unique numbers",
            avoidSimplePin: "Avoid a PIN that’s easy to guess, like 1234 or 1111.",
            alert: {
              title: "Easy PIN",
              content: "Avoid a PIN with simple number sequences and repeated numbers",
              button: "Change it",
            },
          },
          ConfirmPin: {
            title: "Confirm PIN",
            instruction: "Re-enter your 4 numbers",
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
                invalid: "Address line 1 is not valid",
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
              buttonLabel: "Confirm",
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
          title: "Send invite",
          subtitle: "Once your friend has created an account with your unique link, you’ll both receive 15 SAR. ",
          recommendations: "your sent invites",
          copy: "Copy link",
          progress: "In progress",
          completed: "Completed",
          earnt: "Earnt so far",
          linkCopied: "Link copied",
        },
        InstructionsScreen: {
          skip: "Skip",
          continue: "Continue",
          done: "Done",
          titleOne: "Invite friends",
          subTextOne: "Tell a friend or family member about Croatia and earn yourself cash rewards.",
          titleTwo: "Unlimited referrals",
          subTextTwo:
            "Share your referral code to as many people as you like. You’ll earn cash rewards when they start using the app.",
          titleThree: "Both of you get rewards",
          subTextThree: "You'll both earn 15 SAR.",
        },
        TermsAndConditionsScreen: {
          navTitle: "Terms & conditions",
          pageTitle: "Referrals",
          infoBoxContent:
            "What this terms and conditions mean (plceholder text), consectetur adipiscing elit. Quisque ante dui, convallis nec consequat.",
          introductionTitle: "Lorem ipsum",
          introductionContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat. ",
          intellectualPropertyRightsTitle: "Lorem ipsum",
          intellectualPropertyRightsContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat. ",
        },
      },
      FrequentlyAskedQuestions: {
        LandingPage: {
          title: "How can we help you?",
          searchPlaceholder: "I need help with...",
        },
      },
      NotificationManagement: {
        HubScreen: {
          title: "Notifications",
          subtitle: "Choose which notifications you'd like to receive.",
          modalTitle: "About notifications",
          modalContent: "Changes here won't affect your text message notifications.",
        },
      },
      SavingsGoals: {
        Account: {
          from: "From",
          to: "To",
          mainAccount: "Main Account",
        },
        LandingScreen: {
          title: "Achieve your Savings Goals",
          paragraphOne: "Got a dream but it requires a little saving? We’ve got you.",
          paragraphTwo: "Croatia makes it simple to set aside what you need, to get what you want.",
          button: "What’s your goal?",
        },
        InstructionsScreen: {
          skip: "Skip",
          continueButton: "Continue",
          createGoalButton: "Create a new goal",
          titleOne: "Title 1",
          subTextOne:
            "Lorem ipsum dolor sit amet consectetur. Penatibus fermentum placerat auctor neque porttitor convallis in varius et.",
          titleTwo: "Title 2",
          subTextTwo:
            "Lorem ipsum dolor sit amet consectetur. Penatibus fermentum placerat auctor neque porttitor convallis in varius et.",
          titleThree: "Title 3",
          subTextThree:
            "Lorem ipsum dolor sit amet consectetur. Penatibus fermentum placerat auctor neque porttitor convallis in varius et.",
        },
        SavingsGoalsScreen: {
          goalCard: {
            amount: "{{amountSaved}} of {{totalAmount}} SAR",
          },
          title: "Your Goals",
          button: "Create a new goal",
          instructionText: "You can set a total of 4 goals.",
        },
        CreateGoalScreen: {
          title: "Create a goal",
          form: {
            name: {
              label: "Name",
              placeholder: "Name",
              validation: {
                required: "Required*",
                invalid: "Special symbols are not allowed",
              },
            },
            amount: {
              label: "Amount",
              placeholder: "0 SAR",
              currency: "SAR",
              validation: {
                required: "Required*",
                invalid: "Maximum limit for savings goals is 9,999,999,999.99 SAR",
              },
            },
            targetDate: {
              label: "Target Date",
              headerText: "Target Date",
              openDatePickerButton: "Set",
              datePickerButton: "Set",
              validation: {
                required: "Required*",
              },
              helperText: "Note that your target date is within first 31 days from today",
            },
            roundUps: {
              label: "Turn on Round-ups",
              helperText: "For this goal only",
            },
            notification: {
              label: "Turn on Notifications",
              helperText: "For this goal only",
            },
          },
          roundUpsAlreadyActiveAlert: {
            title: "Turn on Round-Ups for this saving goal?",
            message: "Round-ups is already turned on for an other saving goal. Do you want to switch to this one?",
            dontSwitch: "Don't switch",
            switch: "Switch",
          },
          aboutRoundUpsPanel: {
            title: "About Round-ups",
            content:
              "You can Round-Up each purchase you make to the next 5 SAR and then deposit your spare change to a Savings Pot.",
            smallText: "Find out more in our FAQs.",
          },
          button: "Continue",
        },
        FundGoalModal: {
          goalCreatedBanner: "Your goal has been created",
          PickFundingMethodStep: {
            title: "How do you want to save?",
            subText: "Choose how you want to start saving towards your savings goal. ",
            recommended: {
              title: "Recommended monthly amount",
              amount: "{{amount}} SAR / month",
            },
            custom: {
              title: "Custom",
              recurringDeposits: "Recurring deposits",
              oneTimeDeposit: "One-time deposit",
            },
            notNow: "Not Now",
          },
          FundingStep: {
            amountExceedsBalance: "Amount exceeds your balance",
            monthly: "Monthly",
            dayPickerHeader: "Set a date",
            dayPickerButton: "Set",
            dayPickerPlaceholder: "Set",
            helperIfDayExceeds28:
              "Transfer will be made in the last day of the month if selected date don’t exists in the current month.",
            helperIfDayIsAfterTarget:
              "You have selected a date after your target goal date. You should select a date before your target goal date to reach your goal.",
            recurringDeposit: {
              title: "Recurring deposit",
              modalTitle: "You have created a recurring deposit",
              modalText: "Your next recurring payment of {{amount}} SAR will be {{firstPaymentDate}}.",
              continueButton: "Add one-time deposit",
              skipButton: "Not now",
            },
            oneTimeDeposit: {
              title: "One-time deposit",
              modalTitle: "You have created a one-time deposit",
              modalText: "{{amount}} SAR has been added to your savings goals.",
              continueButton: "Add recurring deposit",
              skipButton: "Not now",
            },
            errorTryAgain: "Try again",
            errorNotNow: "Not now",
          },
        },
        WithdrawModal: {
          title: "Withdraw",
          WithdrawButton: "Withdraw",
          amountExceedsBalance: "Amount exceeds your balance",
          successfulWithdrawal: {
            title: "You've withdrawn {{amount}} SAR",
            text: "It's been added to your main account",
          },
          errors: {
            title: "We're sorry - something has gone wrong",
            text: "Please try again later. If things still aren't working, please get in touch",
          },
          buttons: {
            tryAgainButton: "Try again",
            cancelWithdrawalButton: "Cancel withdrawal",
          },
        },
      },
      Cards: {
        standardCard: "Standard card",
        plusCard: "Plus card",
        singleUseCard: "Single-use card",
        generateNew: "Generate New",
        HomeScreen: {
          navTitle: "Home",
        },
        CardDetails: {
          validThru: "VALID\nTHRU",
          securityCode: "SECURITY\nCODE",
        },
      },
      SingleUseCard: {
        InfoScreen: {
          title: "How single-use cards work",
          subTitle:
            "We aim to protect you and your money at all times. Using a virtual card whilst spending online adds another level of security when it comes to data protection.\n\nWe will provide you with a randomly issued card number, expiration date and issue number tied to your account.",
          generateBtn: "Generate single-use card",
        },
      },
      CardActions: {
        QuickMenu: {
          freezeCard: "Freeze card",
          defrost: "Defrost",
          viewPin: "View PIN",
          settings: "Settings",
        },
        ViewPin: {
          navTitle: "Your card PIN",
          button: "Hide PIN",
        },
        CardSettingsScreen: {
          title: "Card settings",
          subTitle1: "Security",
          changePin: "Change Pin",
          onlinePayment: {
            label: "Online payments",
            helperText: "Lorem ipsum dolor",
          },
          internationalPayment: {
            label: "International payments",
            helperText: "Lorem ipsum dolor",
          },
          subTitle2: "Physical card",
          swipePayments: {
            label: "Swipe payments",
            helperText: "Lorem ipsum dolor",
          },
          contactlessPayments: {
            label: "Contactless payments",
            helperText: "Lorem ipsum dolor",
          },
          allowChipWithoutPin: {
            label: "Allow chip without PIN",
            helperText: "Lorem ipsum dolor",
          },
          atmWithdrawals: {
            label: "ATM withdrawals",
            helperText: "Lorem ipsum dolor",
          },
          onTheWay: {
            title: "Your card is on the way",
            paragraph: "These settings will be available once you have received and activated your physical card.",
          },
        },
        OneTimePasswordScreen: {
          resendCode: "Resend Code",
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
          mobilePlaceholder: "أدخل رقم الجوال",
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
          inputSetLabel: "Set",
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
        FatcaDetailsScreen: {
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
          CountrySelector: {
            countryLabel: "ما هي البلد بالتحديد؟",
            countryPlaceholder: "اختر بلدك من القائمة",
            taxNumberLabel: "الرقم الضريبي",
            taxNumberPlaceholder: "0000 0000 0000 0000",
            addButton: "Add",
            continue: "استمرار",
            remove: "Remove country",
            countryListTitle: "Add country",
            errorText: {
              countryRequired: "Country required",
              taxNumberRequired: "UTR required",
              taxNumberInvalid: "يرجى التأكد من الرقم الضريبي",
            },
          },
          InfoBoxCountryTitle: "Country ",
          InfoBoxReferenceTitle: "Unique Reference",
          maxCountriesText: "You’ve reached the maximum amount countries",
        },
        TermsAndConditions: {
          navHeaderTitle: "TERMS",
          title: "Terms of signup",
          checkBoxTermsLabel: "I agree to the Terms and Conditions",
          checkBoxDeclarationLabel: "I agree to the Customer Declaration",
          continue: "Continue",
          terms: {
            sectionOne: {
              title: "Summary heading 1",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
            sectionTwo: {
              title: "Summary heading 2",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
            sectionThree: {
              title: "Summary heading 3",
              desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac dignissim lorem. Morbi quis ipsum erat.",
            },
          },
          declarations: {
            sectionOne: {
              title: "Introduction",
              bodyOne: "The Terms and Conditions shall manage your use of our lifestyle offering, Croatia.",
              bodyTwo:
                "These Terms will be applied fully and affect to your use of Croatia. By using Croatia, you agreed to accept all terms and conditions written in here. You must not use Croatia if you disagree with any of these Standard Terms and Conditions.",
              bodyThree:
                "Minors or people below 18 years old are not allowed to open any banking products with Croatia.",
            },
            sectionTwo: {
              title: "Intellectual Property Rights",
              bodyOne:
                "Other than the content you own, Croatia and/or its licensors own all the intellectual property rights and materials contained in this Website.",
              bodyTwo:
                "You are granted limited license only for purposes of viewing the material contained on this Website.",
              bodyThree: "",
            },
          },
          errorText: {
            alert: "Woops. Could not confirm T&Cs",
          },
        },
      },
      Settings: {
        SettingsScreen: {
          rewards: "Send invite",
          FAQs: "FAQ’s",
          notifications: "Notifications",
        },
      },
      InstructionsScreen: {
        skip: "تخطى",
        continue: "متابعة",
        done: "إنهاء",
        titleOne: "علّمهم عن 'يمدي' وحنا نكافئك",
        subTextOne: "عرّف أصدقائك وعائلتك على 'يمدي' واحصل على مكافأة كاش بحسابك.",
        titleTwo: "الدعوة مفتوحة",
        subTextTwo: "شارك كود الدعوة مع كل إللي تعرفهم وراح نكافئك بكاش من أول لحظة يستخدمون فيها للتطبيق.",
        titleThree: "المكافأة للطرفين",
        subTextThree:
          "مرسل ومُستقبِل الدعوة راح يحصلون على مكافأة 15 ريال سعودي. وعملاء فئة بلس 25 ريال سعودي عن كل دعوة.",
      },
      NotificationManagement: {
        HubScreen: {
          title: "التنبيهات",
          subtitle: "اختر التنبيهات التي تود الحصول على تحديث حولها.",
          modalTitle: "ملاحظة حول التنبيهات",
          modalContent: "التغيرات التي تُجريها هنا لن تؤثر على التنبيهات التي تصلك عبر الرسائل النصية القصيرة.",
        },
      },
      Cards: {
        standardCard: "Standard card",
        plusCard: "Plus card",
        singleUseCard: "Single-use card",
        generateNew: "Generate New",
        HomeScreen: {
          navTitle: "Home",
        },
        CardDetails: {
          validThru: "VALID\nTHRU",
          securityCode: "SECURITY\nCODE",
        },
      },
      SingleUseCard: {
        InfoScreen: {
          title: "How single-use cards work",
          subTitle:
            "We aim to protect you and your money at all times. Using a virtual card whilst spending online adds another level of security when it comes to data protection.\n\nWe will provide you with a randomly issued card number, expiration date and issue number tied to your account.",
          generateBtn: "Generate single-use card",
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
  compatibilityJSON: "v4",
  returnNull: false,
  resources,
});

export default i18n;
