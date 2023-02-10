import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OnboardingContextProvider } from "./context/OnboardingContext";
import ConfirmPersonalDetailsScreen from "./screens/ConfirmPersonalDetailsScreen";
import FatcaDetailsScreen from "./screens/FatcaDetailsScreen";
import CountrySelector from "./screens/FatcaDetailsScreen/CountrySelector";
import { ForeignTaxCountry } from "./screens/FatcaDetailsScreen/types";
import FinancialInformationScreen from "./screens/FinancialInformationScreen";
import IqamaInputScreen from "./screens/IqamaInputScreen";
import NafathAuthScreen from "./screens/NafathAuthScreen";
import OnboardingSplashScreen from "./screens/OnboardingSplashScreen";
import OptionalEmailScreen from "./screens/OptionalEmailScreen";
import PasscodeScreen from "./screens/PasscodeScreen";
import TermsAndConditionsScreen from "./screens/TermsAndConditionsScreen";

export type FatcaScreenTypes = {
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
  "Onboarding.SplashScreen": undefined;
  "Onboarding.Iqama": undefined;
  "Onboarding.Nafath": undefined;
  "Onboarding.ConfirmDetails": undefined;
  "Onboarding.OptionalEmail": undefined;
  "Onboarding.Financial": undefined;
  "Onboarding.Fatca": FatcaScreenTypes | undefined;
  "Onboarding.CountrySelector": OnboardingCountrySelectorParams;
  "Onboarding.Terms": undefined;
  "Onboarding.Passcode": undefined;
};

export const Stack = createNativeStackNavigator<OnboardingStackParams>();

export default function OnboardingStack() {
  return (
    <OnboardingContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={OnboardingSplashScreen} name="Onboarding.SplashScreen" />
        <Stack.Screen component={IqamaInputScreen} name="Onboarding.Iqama" />
        <Stack.Screen component={NafathAuthScreen} name="Onboarding.Nafath" />
        <Stack.Screen component={ConfirmPersonalDetailsScreen} name="Onboarding.ConfirmDetails" />
        <Stack.Screen component={OptionalEmailScreen} name="Onboarding.OptionalEmail" />
        <Stack.Screen component={FinancialInformationScreen} name="Onboarding.Financial" />
        <Stack.Screen component={FatcaDetailsScreen} name="Onboarding.Fatca" />
        <Stack.Screen
          component={CountrySelector}
          name="Onboarding.CountrySelector"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={TermsAndConditionsScreen} name="Onboarding.Terms" />
        <Stack.Screen component={PasscodeScreen} name="Onboarding.Passcode" />
      </Stack.Navigator>
    </OnboardingContextProvider>
  );
}
