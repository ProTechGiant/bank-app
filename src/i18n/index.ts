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
          title: "Sorry, something has gone wrong",
          message: "Try again later or get in touch with our customer care team.",
        },
      },
      Onboarding: {
        SplashScreen: {
          title: "Smarter lifestyle choices with more control",
          buttons: {
            signUp: "Open a Croatia account",
            signIn: "Already have a Croatia account?",
          },
        },
        LandingScreen: {
          success: {
            title: 'Welcome\n "{{userName}}"',
            bannerMessage: "Your account was successfully created!",
          },
          failed: {
            title: "Unfortunately, we can’t create an account for you",
            subtitle: "If you have any concerns, please contact XXXXXXX.",
          },
          pending: {
            title: 'You\'re on your way\n "{{userName}}"',
            bannerMessage: "We’re completing your account setup ",
            accountChecks: {
              identity: "Confirm your identity",
              checks: "Running additional checks",
              creatingAccount: "Creating your account",
            },
            footerMessage:
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
          errorText: {
            alert: "Woops. Could not confirm your personal details",
          },
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
            alert: "Woops. Could not submit your email",
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
          addCountry: "Add tax residency",
          addCountryExtra: "You can add 3 countries in total",
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
          ibanCopied: "IBAN copied",
          balanceHidden: "Balance hidden",
          hideBalanceButton: "Hide balance",
          showBalanceButton: "Show balance",
          myAccountButton: "My account",
          notifications_one: "{{count}} notification",
          notifications_other: "{{count}} notifications",
        },
        HomepageReorderModal: {
          cancel: "CANCEL",
          editActions: "Edit Actions",
          save: "SAVE",
        },
        SectionsReordererModal: {
          cancelButton: "CANCEL",
          title: "Edit Sections",
          saveButton: "SAVE",
        },
        QuickActionsReordererModal: {
          cancelButton: "CANCEL",
          title: "Edit Actions",
          saveButton: "SAVE",
        },
        AccountDetails: {
          navHeader: "Account Details",
          banner: {
            success: "{{dataCopied}} copied to clipboard",
            error: "Couldn't copy {{dataCopied}} - try again",
          },
          tableLabels: {
            name: "Account name",
            type: "Account type",
            holder: "Account holder",
            number: "Account number",
            code: "Bank code",
            iban: "IBAN",
            bankNameLabel: "Bank name",
            bankName: "Croatia Bank",
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
            instruction: "Enter {{count}} unique numbers",
            avoidSimplePin: "Avoid a PIN that’s easy to guess, like 1234 or 1111.",
            errorPinTooEasy: "Avoid a PIN with simple number sequences and repeated numbers",
          },
          ConfirmPin: {
            title: "Confirm PIN",
            instruction: "Re-enter your 4 numbers",
            pinNotMatch: "Your PINs didn’t match, please try again. {{count}} try remaining.",
            pinNotMatch_plural: "Your PINs didn’t match, please try again. {{count}} tries remaining.",
            errorModalTitle: "Try again",
            errorModalMessage: "You’ve entered different PINs too many times.",
            errorModalActionButton: "Set new pin",
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
        HubScreen: {
          title: "Invite friends",
          subtitle:
            "Once your friend has created an account with your unique link, you’ll both receive 15 SAR.\n\n For more details, see our",
          recommendations: "Your sent invites ",
          completed: "Completed",
          earnt: "SAR earnt",
          linkCopied: "Link copied",
          termsAndConditions: " terms and conditions",
          fullStop: ".",
          share: "Share via...",
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
        DetailedSceen: {
          feedback: "Did you find this answer helpful?",
          postiveFeedback: "Thank you.",
          negativeFeedback:
            "Sorry to hear that. If you need more help, you can explore related questions or get in touch.",
          relatedQuestions: "Related questions",
          help: "Need more help?",
          call: "Call Bank",
          chat: "Live Chat",
        },
      },
      NotificationManagement: {
        PermissionAlertModal: {
          title: "Notifications are turned off",
          subtitle: "To enable notifications, go to device settings and turn on notifications for the croatia app",
          back: "Cancel",
          settings: "Go to settings",
        },
        HubScreen: {
          title: "Notifications",
          subtitle: "Choose which notifications you'd like to receive.",
          modalTitle: "About notifications",
          modalContent: "Changes here won't affect your text message notifications.",
        },
        CategoryScreen: {
          subtitle: "Get notifications about:",
        },
      },
      SavingsGoals: {
        Account: {
          from: "From",
          to: "To",
          mainAccount: "Main account",
        },
        LandingScreen: {
          success: {
            title: 'Welcome\n "{{userName}}"',
            bannerMessage: "Your account was successfully created!",
          },
          failed: {
            title: "Unfortunately, we can’t create an account for you",
            subtitle: "If you have any concerns, please contact XXXXXXX.",
          },
          pending: {
            title: 'You\'re on your way\n "{{userName}}"',
            bannerMessage: "We’re completing your account setup ",
            accountChecks: {
              identity: "Confirm your identity",
              checks: "Running additional checks",
              creatingAccount: "Creating your account",
            },
            footerMessage:
              "It can take up to X days for us to finalise this process. An SMS will be sent to you when your account has been created.",
          },
          buttons: {
            FinishLater: "Finish Later",
          },
        },
        InstructionsScreen: {
          skip: "Skip",
          nextButton: "Next",
          setGoalButton: "Set a goal",
          titleOne: "Where to next?",
          subTextOne:
            "What are the hopes and dreams you want to realise? Think big. Think small. Then let’s get to work together to make them happen.",
          titleTwo: "Use Goals to succeed",
          subTextTwo:
            "Use ‘Your Goals’ to make a record of what you want achieve and when. We’ll make it as easy as possible for you meet and surpass your targets.",
          titleThree: "Celebrate the wins",
          subTextThree:
            "That ‘Goal completed’ feeling is unbeatable! And we’ll be there to play back your achievement, and encourage you to embrace what’s next.",
        },
        SavingsGoalsScreen: {
          goalCard: {
            amount: "{{amountSaved}} of {{totalAmount}} SAR",
          },
          title: "Your Goals",
          text: "Dream big or start small. They’re your goals and it’s your future - make it happen!",
          button: "Set new Goal",
          instructionText: "Set up to 4 goals",
          notifications: {
            goalClosed: "Your goal has been closed.",
          },
        },
        GoalDetailsScreen: {
          GoalDetailsHeader: {
            currency: "SAR",
            targetAmountDetails: "of {{TargetAmount}} SAR",
            targetDate: "Target date: {{TargetDate}}",
          },
          Payments: {
            title: "Automatic payments",
          },
          RegularPayment: {
            titleAddRegular: "Add a regular payment",
            titleExistingRegular: "Regular payment",
            text: "{{amount}} {{currency}} on {{day}} of the month",
            day_one: "{{count}}st",
            day_two: "{{count}}nd",
            day_few: "{{count}}rd",
            day_other: "{{count}}th",
          },
          Transactions: {
            title: "Latest Transactions",
            seeAll: "See all",
          },
          RoundUp: "Round-ups",
          InfoModal: {
            title: "About round-ups",
            text: "Round-up every purchase to the nearest 5 SAR. The extra will go towards your choice of goal.",
            link: "Find out more in our FAQs",
          },
          GoalAlmostReachedModal: {
            title: "Are you sure you want to withdraw money?",
            message:
              "You’re only {{amount}} SAR away from your goal – and withdrawing money will move you further away.",
            withdrawButton: "Withdraw",
            cancelButton: "Cancel",
          },
          RoundUpAlreadyActiveModal: {
            title: "Turn on round-ups for this goal?",
            message: "You’re already using round-ups for another goal. Do you want to switch to this one?",
            switchRoundUpButton: "Switch to this goal",
            cancelButton: "Don’t switch",
          },
          ActionButtons: {
            withdrawButton: "Withdraw",
            addMoneyButton: "Add money",
          },
        },
        CreateGoalScreen: {
          title: "Goal details",
          form: {
            name: {
              label: "Goal name",
              placeholder: "Name",
              validation: {
                required: "Your goal needs a name*",
                invalid: "Please avoid special characters",
              },
            },
            amount: {
              label: "Goal amount",
              placeholder: "0 SAR",
              currency: "SAR",
              validation: {
                required: "Your goal needs an amount*",
                invalid: "The maximum amount is 9,999,999,999.99 SAR",
                positive: "Please use only positive numbers",
              },
            },
            targetDate: {
              label: "Complete by",
              headerText: "Complete by",
              openDatePickerButton: "Pick date",
              datePickerButton: "Pick date",
              validation: {
                required: "Required*",
              },
              helperText:
                "Your date isn't very far away. Think about whether this is enough time to save for your goal.",
            },
            roundUps: {
              label: "Turn on round-ups",
              helperText: "For this goal only",
            },
            notification: {
              label: "Turn on notifications",
              helperText: "For this goal only",
            },
          },
          roundUpsAlreadyActiveAlert: {
            title: "Turn on Round-Ups for this saving goal?",
            message: "Round-ups is already turned on for an other saving goal. Do you want to switch to this one?",
            dontSwitch: "Don't switch",
            switch: "Switch",
          },
          notificationsTurnOnAlert: {
            title: "Notifications are disabled",
            message: "Would you like to turn on notifications?",
            cancel: "Cancel",
            turnOn: "Turn on",
          },
          aboutRoundUpsPanel: {
            title: "About round-ups",
            content: "Round up every purchase to the nearest 5 SAR. The extra will go towards your choice of goal.",
            smallText: "For more details visit FAQs",
          },
          button: "Continue",
        },
        EditGoalScreen: {
          save: "Save",
          notifications: {
            label: "Turn on notifications",
            helperText: "Only for this goal",
          },
          closeGoal: "Close goal",
          modal: {
            title: "Are you sure you want to close this goal?",
            content: "The money in this goal will go back into your main account",
            buttons: {
              confirm: "Confirm",
              cancel: "Cancel",
            },
          },
        },
        FundGoalModal: {
          goalCreatedBanner: "Your goal has been created",
          PickFundingMethodStep: {
            title: "How will you meet your goal?",
            subText: "Regular payments help bring your goal closer to reality. ",
            recommended: {
              title: "Recommended monthly amount",
              amount: "{{amount}} SAR / month",
            },
            custom: {
              title: "Custom",
              regularPayments: "Regular Payments",
              oneOffPayment: "One-off payment",
            },
            notNow: "Not Now",
          },
          FundingStep: {
            amountExceedsBalance: "You don't have enough money in your account",
            monthly: "Monthly",
            dayPickerHeader: "Set a date",
            dayPickerButton: "Set",
            dayPickerPlaceholder: "Set",
            helperIfDayExceeds28:
              "If a month is too short for your date to exist, the payment will happen on the last day of the month.",
            helperIfDayIsAfterTarget:
              "Your date isn't very far away. Think about whether this is enough time to save for your goal.",
            continueButton: "Continue",
            regularPayments: {
              title: "Regular payments",
              modalTitle: "You have created a regular payment",
              modalText: "Your next payment will be {{amount}} SAR on {{firstPaymentDate}}.",
              continueButton: "Add one-off payment",
              skipButton: "Skip",
            },
            oneOffPayment: {
              title: "One-off payment",
              modalTitle: "You sent a one-off payment",
              modalText: "{{amount}} SAR has been added to your goal.",
              continueButton: "Set up regular payment",
              skipButton: "Skip",
            },
            errorTryAgain: "Try again",
            errorNotNow: "Not now",
          },
        },
        WithdrawModal: {
          title: "Withdraw from goal",
          WithdrawButton: "Withdraw",
          amountExceedsBalance: "Amount is more than your goal balance",
          zeroAmountError: "Amount must be greater than 0.01",
          successfulWithdrawal: {
            title: "You've withdrawn {{amount}} SAR",
            text: "It's been added to your main account.",
          },
          errors: {
            title: "We’re sorry - something has gone wrong",
            text: "No funds have been withdrawn, please try again later.",
          },
          buttons: {
            tryAgainButton: "Try again",
            cancelWithdrawalButton: "Cancel withdrawal",
          },
        },
        EditModal: {
          title: "Edit goal",
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
          atmWithdrawals: {
            label: "ATM withdrawals",
            helperText: "Lorem ipsum dolor",
          },
          onTheWay: {
            title: "Your card is on the way",
            paragraph: "These settings will be available once you have received and activated your physical card.",
          },
        },
        OneTimePasswordModal: {
          title: "Enter one-time password",
          message:
            "Enter the 2-step verification code that we texted to your phone number, {{hiddenNumber}} {{phoneNumber}}.",
          resendCode: "Resend Code",
          errors: {
            invalidPassword: "The code you entered was invalid. Please try again",
            reachedMaxAttempts:
              "You have reached the maximum number of authentication attempts. Please try again later.",
          },
        },
        CardDetailsScreen: {
          navTitleStandard: "Standard card",
          navTitlePlus: "Plus card",
          navTitleSingleUse: "One-time card",
          inactiveCard: {
            label: "On the way",
            actionButtonText: "Activate now",
          },
          iconButtonText: {
            show: "Show details",
            hide: "Hide details",
            freeze: "Freeze",
            unfreeze: "Defrost",
            viewPin: "View PIN",
            showCredentials: "Show card credentials",
            hideCredentials: "Hide card credentials",
            about: "About",
          },
          manageCardHeader: "Manage card",
          cardSettingsButton: "Card settings",
          reportButton: "Report stolen or damaged",
          accountHeader: "Linked account",
          accountNumber: "Account number",
          accountName: "Account name",
          upgradeToCroatiaPlus: {
            breadcrumb: "Ultimate Experience",
            header: "Croatia Plus",
            content:
              "Upgrade your tier to get an exclusive card and enjoy priority support and other premium benefits.",
            button: "Explore Plus tier",
          },
          copyClipboard: "Card number copied to clipboard.",
          errorCopyClipboard: "Couldn’t copy card number - try again.",
        },

        standardCard: "Standard card",
        plusCard: "Plus card",
        singleUseCard: "One-time card",
        cardFrozen: "Card frozen",
        generateNew: "Generate New",
        HomeScreen: {
          navTitle: "Home",
        },
        CardDetails: {
          validThru: "VALID\nTHRU",
          securityCode: "SECURITY\nCODE",
        },
        SingleUseCard: {
          CardAbout: {
            title: "One-time cards",
            SectionOne: {
              title: "Why use them?",
              SectionOneInfo: {
                label: "Keep your card details safe",
                helperText: "Online retailers can’t see your real card details – perfect for sellers you don’t know.",
              },
              SectionTwoInfo: {
                label: "Protect yourself from fraud",
                helperText: "Once you’ve paid, your card details are useless to fraudsters.",
              },
            },
            SectionTwo: {
              title: "How do they work?",
              SectionOneInfo: {
                label: "Online only",
                helperText:
                  "One-time cards are for online purchases up to your regular card limit - not regular payments or subscriptions.",
              },
              SectionTwoInfo: {
                label: "30-day limit",
                helperText: "Your old one-time cards stop working after 30 days.",
              },
              SectionThreeInfo: {
                label: "Spend from your main account",
                helperText: "One-time cards are linked to your main Croatia account.",
              },

              SectionFourInfo: {
                label: "Hassle-free refunds",
                helperText: "Need a refund? You’ll still get it, even if you’ve used the card already.",
              },
              SectionFiveInfo: {
                label: "Croatia Plus only",
                helperText: "One-time cards are exclusive to Croatia Plus.",
              },
            },
          },
          CardCreation: {
            successTitle: "New one-time card generated",
            successMessage: "Use these card details to make your purchase.",
          },
          SingleUseCardsInfo: {
            title: "How do one-time cards work?",
            text: "They’re virtual debit cards that you can only use once, so they’re great for protecting yourself when you buy online.\n\nWhen you generate a one-time card, you get a single-use card number, expiry and CVV. They’ll only work for one purchase and mean the merchant can’t see your real card details - so they’re a safer way to spend.",
            generateButton: "Generate one-time card",
          },
        },
        ResetPincodeScreen: {
          setPin: "Set new PIN",
          enterNumbers: "Enter {{count}} numbers",
          errorPincodeTooEasy: "Your PIN is too easy. Avoid consecutive or repeated numbers.",
          avoidTooEasyPin: "Avoid a PIN that’s easy to guess, like 1234 or 1111",
          confirmPin: "Confirm new PIN",
          reEnterPincode: "Re-enter {{count}} numbers",
          errorPinDoesntMatch_one: "That PIN doesn’t match. You have {{count}} attempt left.",
          errorPinDoesntMatch_other: "That PIN doesn’t match. You have {{count}} attempts left.",
          errorModalTitle: "Try again",
          errorModalMessage: "You’ve entered different PINs too many times.",
          errorModalActionButton: "Set new pin",
        },
      },
      AddMoneyInfo: {
        title: "Add money by bank transfer",
        description:
          "To add money to your Croatia account, use these details to set up a money transfer from another bank.",
        note: "The name you use for your transfer must exactly match your name here.",
        processingTime: "Processing time",
        processingTimeInfo:
          "Bank transfers will normally reach your Croatia account the same day or the next business day.",

        BankDetails: {
          title: "Your Croatia bank details",
          recipientName: "Your name",
          recipientIBAN: "Your IBAN",
          bankName: "Bank name",
          recipientAddress: "Your address",
          copyInfo: "copied to clipboard.",
          errorCopy: "Couldn’t copy",
          tryAgain: "try again.",
        },
      },
    },
  },
  ar: {
    translation: {
      TableList: {
        datePicker: {
          placeholder: "Set",
          headerText: "Set Date",
          buttonText: "Set",
        },
      },
      home: {
        AccountDetails: {
          navHeader: "Account Details",
          banner: {
            success: "{{dataCopied}} copied to clipboard",
            error: "Couldn't copy {{dataCopied}} - try again",
          },
          tableLabels: {
            name: "Account name",
            type: "Account type",
            holder: "Account holder",
            number: "Account number",
            code: "Bank code",
            iban: "IBAN",
            bankNameLabel: "Bank name",
            bankName: "Croatia Bank",
          },
        },
      },
      errors: {
        generic: {
          title: "Sorry, something has gone wrong",
          message: "Try again later or get in touch with our customer care team.",
        },
      },
      Onboarding: {
        SplashScreen: {
          title: "أنت الآن في السيطرة",
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
          errorText: {
            alert: "Woops. Could not submit your email",
          },
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
          addCountry: "Add tax residency",
          addCountryExtra: "You can add 3 countries in total",
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
          rewards: "أرسل دعوة",
          FAQs: "الأسئلة الشائعة",
          notifications: "التنبيهات",
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
        CategoryScreen: {
          subtitle: "احصل على تنبيهات حول:",
        },
      },
      Referral: {
        HubScreen: {
          title: "أرسل دعوة",
          subtitle:
            "عند إنشاء حساب من الرابط الخاص بك، سيحصل الطرفين على 15 ر.س مكافأة كاش في حسابك.\n\nلمزيد من التفاصيل، يرجى الاطلاع على ",
          recommendations: "الدعوات المُرسَلة",
          completed: "مُرسَلة",
          earnt: "مجموع المكافآت",
          linkCopied: "تم نسخ الرابط",
          termsAndConditions: "  الشروط والأحكام",
          fullStop: ".",
          share: "إرسال",
        },
        InstructionsScreen: {
          skip: "تخطى",
          continue: "متابعة",
          done: "إنهاء",
          titleOne: 'علّمهم عن "يمدي" وحنا نكافئك',
          subTextOne: 'عرّف أصدقائك وعائلتك على "يمدي" واحصل على مكافأة كاش بحسابك.',
          titleTwo: "الدعوة مفتوحة",
          subTextTwo: "شارك كود الدعوة مع كل إللي تعرفهم وراح نكافئك بكاش من أول لحظة يستخدمون فيها للتطبيق.",
          titleThree: "المكافأة للطرفين",
          subTextThree: "مرسل الدعوة ومستقبِلها بيحصلون على 15 ر.س.",
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
          atmWithdrawals: {
            label: "ATM withdrawals",
            helperText: "Lorem ipsum dolor",
          },
          onTheWay: {
            title: "Your card is on the way",
            paragraph: "These settings will be available once you have received and activated your physical card.",
          },
        },
        OneTimePasswordModal: {
          title: "Enter one-time password",
          message:
            "Enter the 2-step verification code that we texted to your phone number, {{hiddenNumber}} {{phoneNumber}}.",
          resendCode: "Resend Code",
          errors: {
            invalidPassword: "The code you entered was invalid. Please try again",
            reachedMaxAttempts:
              "You have reached the maximum number of authentication attempts. Please try again later.",
          },
        },
        CardDetailsScreen: {
          navTitleStandard: "Standard card",
          navTitlePlus: "Plus card",
          navTitleSingleUse: "One-time card",
          inactiveCard: {
            label: "On the way",
            actionButtonText: "Activate now",
          },
          iconButtonText: {
            show: "Show details",
            hide: "Hide details",
            freeze: "Freeze",
            unfreeze: "Defrost",
            viewPin: "View PIN",
            showCredentials: "Show card credentials",
            hideCredentials: "Hide card credentials",
            about: "About",
          },
          manageCardHeader: "Manage card",
          cardSettingsButton: "Card settings",
          reportButton: "Report stolen or damaged",
          accountHeader: "Linked account",
          accountNumber: "Account number",
          accountName: "Account name",
          upgradeToCroatiaPlus: {
            breadcrumb: "Ultimate Experience",
            header: "Croatia Plus",
            content:
              "Upgrade your tier to get an exclusive card and enjoy priority support and other premium benefits.",
            button: "Explore Plus tier",
          },
          copyClipboard: "Card number copied to clipboard.",
          errorCopyClipboard: "Couldn’t copy card number - try again.",
        },

        standardCard: "Standard card",
        plusCard: "Plus card",
        singleUseCard: "One-time card",
        cardFrozen: "Card frozen",
        generateNew: "Generate New",
        HomeScreen: {
          navTitle: "Home",
        },
        CardDetails: {
          validThru: "VALID\nTHRU",
          securityCode: "SECURITY\nCODE",
        },
        SingleUseCard: {
          CardAbout: {
            title: "One-time cards",
            SectionOne: {
              title: "Why use them?",
              SectionOneInfo: {
                label: "Keep your card details safe",
                helperText: "Online retailers can’t see your real card details – perfect for sellers you don’t know.",
              },
              SectionTwoInfo: {
                label: "Protect yourself from fraud",
                helperText: "Once you’ve paid, your card details are useless to fraudsters.",
              },
            },
            SectionTwo: {
              title: "How do they work?",
              SectionOneInfo: {
                label: "Online only",
                helperText:
                  "One-time cards are for online purchases up to your regular card limit - not regular payments or subscriptions.",
              },
              SectionTwoInfo: {
                label: "30-day limit",
                helperText: "Your old one-time cards stop working after 30 days.",
              },
              SectionThreeInfo: {
                label: "Spend from your main account",
                helperText: "One-time cards are linked to your main Croatia account.",
              },

              SectionFourInfo: {
                label: "Hassle-free refunds",
                helperText: "Need a refund? You’ll still get it, even if you’ve used the card already.",
              },
              SectionFiveInfo: {
                label: "Croatia Plus only",
                helperText: "One-time cards are exclusive to Croatia Plus.",
              },
            },
          },
          CardCreation: {
            successTitle: "New one-time card generated",
            successMessage: "Use these card details to make your purchase.",
          },
          SingleUseCardsInfo: {
            title: "How do one-time cards work?",
            text: "They’re virtual debit cards that you can only use once, so they’re great for protecting yourself when you buy online.\n\nWhen you generate a one-time card, you get a single-use card number, expiry and CVV. They’ll only work for one purchase and mean the merchant can’t see your real card details - so they’re a safer way to spend.",
            generateButton: "Generate one-time card",
          },
        },
      },
    },
    AddMoneyInfo: {
      title: "Add money by bank transfer",
      description:
        "To add money to your Croatia account, use these details to set up a money transfer from another bank.",
      note: "The name you use for your transfer must exactly match your name here.",
      processingTime: "Processing time",
      processingTimeInfo:
        "Bank transfers will normally reach your Croatia account the same day or the next business day.",

      BankDetails: {
        title: "Your Croatia bank details",
        recipientName: "Your name",
        recipientIBAN: "Your IBAN",
        bankName: "Bank name",
        recipientAddress: "Your address",
        copyInfo: "copied to clipboard",
        errorCopy: "Couldn’t copy",
        tryAgain: "try again",
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
