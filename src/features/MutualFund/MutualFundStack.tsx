import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MutualFundDashboardScreen, MutualFundEntryPointScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type MutualFundStackParams = {
  "MutualFund.EntryPoint": undefined;
  "MutualFund.Dashboard": undefined;
};

export default function MutualFundStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={MutualFundEntryPointScreen} name="MutualFund.EntryPoint" />
      <Stack.Screen component={MutualFundDashboardScreen} name="MutualFund.Dashboard" />
    </Stack.Navigator>
  );
}
