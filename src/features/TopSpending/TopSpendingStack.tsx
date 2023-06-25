import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SpendSummaryScreen } from "./screens";
import { TransactionDetailed } from "./types";

export const Stack = createNativeStackNavigator();

export type TopSpendingStackParams = {
  "TopSpending.SpendSummaryScreen": {
    data: TransactionDetailed;
    cardId?: string;
    createDisputeUserId?: string; // TODO: temporary user ID for create dispute case
  };
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
