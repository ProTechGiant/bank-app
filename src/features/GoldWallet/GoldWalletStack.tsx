import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HubScreen, OnboardingScreen, TermsAndConditionsModal } from "./screens";

export type GoldWalletStackParams = {
  "GoldWalletStack.TermsAndConditions": undefined;
  "GoldWallet.HubScreen": undefined;
  "GoldWallet.OnboardingScreen": undefined;
};

export const Stack = createNativeStackNavigator<GoldWalletStackParams>();

export default function GoldWalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HubScreen} name="GoldWallet.HubScreen" />
      <Stack.Screen component={TermsAndConditionsModal} name="GoldWalletStack.TermsAndConditions" />
      <Stack.Screen component={OnboardingScreen} name="GoldWallet.OnboardingScreen" />
    </Stack.Navigator>
  );
}
