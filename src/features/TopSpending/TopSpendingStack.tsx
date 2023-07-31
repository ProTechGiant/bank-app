import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  ExcludedDetailedScreen,
  SingleTagScreen,
  SpendingComparisonScreen,
  SpendSummaryScreen,
  TopSpendingScreen,
} from "./screens";
import { Tag } from "./types";

export const Stack = createNativeStackNavigator();

export type TopSpendingStackParams = {
  "TopSpending.TopSpendingScreen": { comparisonDate: string };
  "TopSpending.SpendingComparisonScreen": undefined;
  "TopSpending.SpendSummaryScreen": {
    cardId?: string;
    createDisputeUserId?: string; // TODO: temporary user ID for create dispute case
    categoryId: string;
    categoryName: string;
    iconPath: string;
    startDate?: string;
    endDate?: string;
  };
  "TopSpending.SingleTagScreen": { data: Tag; startDate?: string; endDate?: string };
  "TopSpending.ExcludedDetailedScreen": {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    startDate?: string;
    endDate?: string;
  };
};

export default function TopSpendingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={TopSpendingScreen} name="TopSpending.TopSpendingScreen" />
      <Stack.Screen component={SpendingComparisonScreen} name="TopSpending.SpendingComparisonScreen" />
      <Stack.Screen component={ExcludedDetailedScreen} name="TopSpending.ExcludedDetailedScreen" />
      <Stack.Screen component={SpendSummaryScreen} name="TopSpending.SpendSummaryScreen" />
      <Stack.Screen component={SingleTagScreen} name="TopSpending.SingleTagScreen" />
    </Stack.Navigator>
  );
}
