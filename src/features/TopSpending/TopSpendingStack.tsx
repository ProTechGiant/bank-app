import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SpendSummaryScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type TopSpendingStackParams = {
  "TopSpending.TopSpendingScreen": undefined;
};

export default function TopSpendingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={SpendSummaryScreen} name="TopSpending.SpendSummaryScreen" />
    </Stack.Navigator>
  );
}
