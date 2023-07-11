import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ExcludedDetailedScreen, SelectTagScreen, SpendSummaryScreen, TopSpendingScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type TopSpendingStackParams = {
  "TopSpending.TopSpendingScreen": undefined;
  "TopSpending.SpendSummaryScreen": {
    cardId?: string;
    createDisputeUserId?: string; // TODO: temporary user ID for create dispute case
    categoryId: string;
    categoryName: string;
    iconPath: string;
  };
  "TopSpending.ExcludedDetailedScreen": {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
  };
  "TopSpending.SelectTagScreen": undefined;
};

export default function TopSpendingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={TopSpendingScreen} name="TopSpending.TopSpendingScreen" />
      <Stack.Screen component={ExcludedDetailedScreen} name="TopSpending.ExcludedDetailedScreen" />

      <Stack.Screen component={SelectTagScreen} name="TopSpending.SelectTagScreen" />
      <Stack.Screen component={SpendSummaryScreen} name="TopSpending.SpendSummaryScreen" />
    </Stack.Navigator>
  );
}
