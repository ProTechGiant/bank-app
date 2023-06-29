import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HubScreen, InstructionsScreen, TermsAndConditionsScreen } from "./screens";

export type ReferralStackParams = {
  "Referral.HubScreen": undefined;
  "Referral.InstructionsScreen": undefined;
  "Referral.TermsAndConditionsScreen": undefined;
};

export const Stack = createNativeStackNavigator<ReferralStackParams>();

export default function ReferralStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={HubScreen} name="Referral.HubScreen" />
        <Stack.Screen component={InstructionsScreen} name="Referral.InstructionsScreen" />
        <Stack.Screen
          component={TermsAndConditionsScreen}
          name="Referral.TermsAndConditionsScreen"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
