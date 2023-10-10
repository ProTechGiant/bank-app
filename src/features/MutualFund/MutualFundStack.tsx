import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DiscoverProductsScreen, MutualFundDashboardScreen, MutualFundEntryPointScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type MutualFundStackParams = {
  "MutualFund.EntryPoint": undefined;
  "MutualFund.DiscoverProducts": undefined;
  "MutualFund.Dashboard": undefined;
};

export default function MutualFundStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={MutualFundEntryPointScreen} name="MutualFund.EntryPoint" />
      <Stack.Screen component={DiscoverProductsScreen} name="MutualFund.DiscoverProducts" />
      <Stack.Screen component={MutualFundDashboardScreen} name="MutualFund.Dashboard" />
    </Stack.Navigator>
  );
}
