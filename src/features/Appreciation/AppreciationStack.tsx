import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CustomerTierEnum } from "@/types/CustomerProfile";

import { AppreciationDetailsScreen, AppreciationHubScreen, TermsAndConditionsModal } from "./screens";
import { AppreciationType } from "./types";

export type AppreciationStackParams = {
  "Appreciation.HubScreen": undefined;
  "Appreciation.TermsAndConditionsScreen": undefined;
  "Appreciation.AppreciationDetailsScreen": { appreciation: AppreciationType; userType: CustomerTierEnum };
};

export const Stack = createNativeStackNavigator<AppreciationStackParams>();

export default function AppreciationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AppreciationHubScreen} name="Appreciation.HubScreen" />
      <Stack.Screen component={AppreciationDetailsScreen} name="Appreciation.AppreciationDetailsScreen" />
      <Stack.Screen component={TermsAndConditionsModal} name="Appreciation.TermsAndConditionsScreen" />
    </Stack.Navigator>
  );
}
