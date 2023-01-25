import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OnboardingContextProvider } from "./context/OnboardingContext";
import ConfirmPersonalDetailsScreen from "./screens/ConfirmPersonalDetailsScreen";
import FinancialInformationScreen from "./screens/FinancialInformationScreen";
import ForeignTaxScreen from "./screens/ForeignTaxScreen";
import IqamaInputScreen from "./screens/IqamaInputScreen";
import NafathAuthScreen from "./screens/NafathAuthScreen";
import OnboardingSplashScreen from "./screens/OnboardingSplashScreen";
import OptionalEmailScreen from "./screens/OptionalEmailScreen";

export type OnboardingStackParams = {
  "Onboarding.SplashScreen": undefined;
  "Onboarding.Iqama": undefined;
  "Onboarding.Nafath": undefined;
  "Onboarding.ConfirmDetails": undefined;
  "Onboarding.OptionalEmail": undefined;
  "Onboarding.Financial": undefined;
  "Onboarding.ForeignTax": undefined;
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
        <Stack.Screen component={ForeignTaxScreen} name="Onboarding.ForeignTax" />
      </Stack.Navigator>
    </OnboardingContextProvider>
  );
}
