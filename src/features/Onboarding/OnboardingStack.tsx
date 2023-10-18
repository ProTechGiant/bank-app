import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CountrySelector } from "./components";
import { OnboardingContextProvider } from "./contexts/OnboardingContext";
import {
  AppIntroAnimationScreen,
  ConfirmPasscodeScreen,
  ConfirmPersonalDetailsScreen,
  CreatePasscodeScreen,
  FastOnboardingScreen,
  FatcaDetailsScreen,
  FinancialInformationScreen,
  HighRiskRequireDocumentScreen,
  IqamaInputScreen,
  NafathAuthScreen,
  OptionalEmailScreen,
  PendingAccountScreen,
  SplashScreen,
  SuccessScreen,
  TermsAndConditionsDetailsScreen,
  TermsAndConditionsScreen,
  UnmatchedArbNumberScreen,
  UploadDocumentScreen,
  WelcomeCarouselScreen,
  WorkGuideModal,
} from "./screens";
import { ForeignTaxCountry } from "./types";

type FatcaScreenTypes = {
  result: "insert" | "edit" | "remove";
  element?: ForeignTaxCountry; // applicable to "insert", "edit"
  elementIndex?: number; // applicable to "edit", "remove"
};

type OnboardingCountrySelectorParams = {
  action: "insert" | "edit";
  disabled?: string[]; // applicable to "insert"
  element?: ForeignTaxCountry; // applicable to "edit"
  elementIndex?: number; // applicable to "edit"
};

export type OnboardingStackParams = {
  "Onboarding.WelcomeCarousel": undefined;
  "Onboarding.AppIntroAnimation": undefined;
  "Onboarding.SplashScreen": undefined;
  "Onboarding.Iqama": undefined;
  "Onboarding.Nafath": undefined;
  "Onboarding.ConfirmDetails": undefined;
  "Onboarding.OptionalEmail": undefined;
  "Onboarding.Financial": undefined;
  "Onboarding.Fatca": FatcaScreenTypes | undefined;
  "Onboarding.CountrySelector": OnboardingCountrySelectorParams;
  "Onboarding.TermsAndConditions": undefined;
  "Onboarding.PendingAccount": undefined;
  "Onboarding.CreatePasscode": undefined;
  "Onboarding.ConfirmPasscode": { passcode: string };
  "Onboarding.WorkGuideModal": undefined;
  "Onboarding.TermsAndConditionsDetails": undefined;
  "Onboarding.SuccessScreen": {
    passcode: string;
  };
  "Onboarding.FastOnboardingScreen": undefined;
  "Onboarding.UnmatchedArbNumberScreen": undefined;
  "Onboarding.HighRiskRequireDocumentScreen": undefined;
  "Onboarding.UploadDocumentScreen": undefined;
};

export const Stack = createNativeStackNavigator<OnboardingStackParams>();

export default function OnboardingStack() {
  return (
    <OnboardingContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={AppIntroAnimationScreen} name="Onboarding.AppIntroAnimation" />
        <Stack.Screen component={FastOnboardingScreen} name="Onboarding.FastOnboardingScreen" />
        <Stack.Screen component={SplashScreen} name="Onboarding.SplashScreen" />
        <Stack.Screen component={WelcomeCarouselScreen} name="Onboarding.WelcomeCarousel" />
        <Stack.Screen component={IqamaInputScreen} name="Onboarding.Iqama" />
        <Stack.Screen component={NafathAuthScreen} name="Onboarding.Nafath" />
        <Stack.Screen component={UnmatchedArbNumberScreen} name="Onboarding.UnmatchedArbNumberScreen" />
        <Stack.Screen component={ConfirmPersonalDetailsScreen} name="Onboarding.ConfirmDetails" />
        <Stack.Screen component={OptionalEmailScreen} name="Onboarding.OptionalEmail" />
        <Stack.Screen component={FinancialInformationScreen} name="Onboarding.Financial" />
        <Stack.Screen component={FatcaDetailsScreen} name="Onboarding.Fatca" />
        <Stack.Screen
          component={CountrySelector}
          name="Onboarding.CountrySelector"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={TermsAndConditionsScreen} name="Onboarding.TermsAndConditions" />
        <Stack.Screen component={TermsAndConditionsDetailsScreen} name="Onboarding.TermsAndConditionsDetails" />
        <Stack.Screen component={CreatePasscodeScreen} name="Onboarding.CreatePasscode" />
        <Stack.Screen component={HighRiskRequireDocumentScreen} name="Onboarding.HighRiskRequireDocumentScreen" />
        <Stack.Screen component={UploadDocumentScreen} name="Onboarding.UploadDocumentScreen" />
        <Stack.Screen component={ConfirmPasscodeScreen} name="Onboarding.ConfirmPasscode" />
        <Stack.Screen component={PendingAccountScreen} name="Onboarding.PendingAccount" />
        <Stack.Screen component={WorkGuideModal} name="Onboarding.WorkGuideModal" options={{ presentation: "modal" }} />
        <Stack.Screen component={SuccessScreen} name="Onboarding.SuccessScreen" />
      </Stack.Navigator>
    </OnboardingContextProvider>
  );
}
