import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { CountrySelector } from "./components";
import { OnboardingContextProvider } from "./contexts/OnboardingContext";
import {
  AppIntroAnimationScreen,
  ConfirmPasscodeScreen,
  ConfirmPersonalDetailsScreen,
  CreatePasscodeScreen,
  FastOnboardingScreen,
  FatcaDetailsScreen,
  HighRiskRequireDocumentScreen,
  IncomeDetailsScreen,
  IqamaInputScreen,
  NafathAuthScreen,
  NafathCodeScreen,
  OccupationInfoScreen,
  OptionalEmailScreen,
  PendingAccountScreen,
  PreviewDocumentScreen,
  SplashScreen,
  SuccessScreen,
  TermsAndConditionsDetailsScreen,
  TermsAndConditionsScreen,
  UnmatchedArbNumberScreen,
  UploadDocumentScreen,
  VerifyingInformationScreen,
  WelcomeCarouselScreen,
  WorkGuideModal,
} from "./screens";
import OnboardingOtpScreen from "./screens/OnboardingOtpScreen";
import { ForeignTaxCountry, OccupationalInfo } from "./types";

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
  "Onboarding.NafathCode": undefined;
  "Onboarding.ConfirmDetails": undefined;
  "Onboarding.OptionalEmail": undefined;
  "Onboarding.OccupationInfoScreen": { userName: string };
  "Onboarding.IncomeDetailsScreen": { userName: string; occupationalInfo: OccupationalInfo };
  "Onboarding.Fatca": FatcaScreenTypes | undefined;
  "Onboarding.CountrySelector": OnboardingCountrySelectorParams;
  "Onboarding.TermsAndConditions": undefined;
  "Onboarding.PendingAccount": undefined;
  "Onboarding.CreatePasscode": undefined;
  "Onboarding.ConfirmPasscode": { passcode: string };
  "Onboarding.WorkGuideModal": undefined;
  "Onboarding.TermsAndConditionsDetails": undefined;
  "Onboarding.OnboardingOtpScreen": { phoneNumber: number };
  "Onboarding.SuccessScreen": {
    passcode: string;
  };
  "Onboarding.FastOnboardingScreen": undefined;
  "Onboarding.UnmatchedArbNumberScreen": undefined;
  "Onboarding.HighRiskRequireDocumentScreen": undefined;
  "Onboarding.UploadDocumentScreen": undefined;
  "Onboarding.VerifyingInformationScreen": undefined;
  "Onboarding.PreviewDocumentScreen": {
    base64File: { content: string; name: string; type: string } | undefined;
    caseAnnotationId: string;
  };
};

export const Stack = createNativeStackNavigator<OnboardingStackParams>();
export type OnboardingStackParamsNavigationProp = NativeStackNavigationProp<OnboardingStackParams>;

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
        <Stack.Screen component={NafathCodeScreen} name="Onboarding.NafathCode" />
        <Stack.Screen component={UnmatchedArbNumberScreen} name="Onboarding.UnmatchedArbNumberScreen" />
        <Stack.Screen component={ConfirmPersonalDetailsScreen} name="Onboarding.ConfirmDetails" />
        <Stack.Screen component={OptionalEmailScreen} name="Onboarding.OptionalEmail" />
        <Stack.Screen component={OnboardingOtpScreen} name="Onboarding.OnboardingOtpScreen" />
        <Stack.Screen component={OccupationInfoScreen} name="Onboarding.OccupationInfoScreen" />
        <Stack.Screen component={IncomeDetailsScreen} name="Onboarding.IncomeDetailsScreen" />
        <Stack.Screen component={FatcaDetailsScreen} name="Onboarding.Fatca" />
        <Stack.Screen component={PreviewDocumentScreen} name="Onboarding.PreviewDocumentScreen" />
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
        <Stack.Screen component={VerifyingInformationScreen} name="Onboarding.VerifyingInformationScreen" />
        <Stack.Screen component={ConfirmPasscodeScreen} name="Onboarding.ConfirmPasscode" />
        <Stack.Screen component={PendingAccountScreen} name="Onboarding.PendingAccount" />
        <Stack.Screen component={WorkGuideModal} name="Onboarding.WorkGuideModal" options={{ presentation: "modal" }} />
        <Stack.Screen component={SuccessScreen} name="Onboarding.SuccessScreen" />
      </Stack.Navigator>
    </OnboardingContextProvider>
  );
}
