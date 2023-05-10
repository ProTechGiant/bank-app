import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { palette } from "@/theme/values";

import { PendingTransactionsScreen, SingleTransactionDetailedScreen, TransactionsScreen } from "./screens/";
import { TransactionDetailed } from "./types";

export type ViewTransactionsStackParams = {
  "ViewTransactions.TransactionsScreen": {
    cardId: string;
    createDisputeUserId: string; // TODO: temporary user ID for create dispute case
  };
  "ViewTransactions.PendingTransactionsScreen": {
    cardId: string;
    createDisputeUserId: string; // TODO: temporary user ID for create dispute case
  };
  "ViewTransactions.SingleTransactionDetailedScreen": {
    data: TransactionDetailed;
    cardId: string;
    createDisputeUserId: string; // TODO: temporary user ID for create dispute case
  };
};

const Stack = createNativeStackNavigator<ViewTransactionsStackParams>();

export default function ViewTransactionsStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.primaryBase },
        headerTintColor: palette["neutralBase-50"],
        headerTitleAlign: "center",
        headerShown: true,
      }}>
      <Stack.Screen
        options={{ title: t("ViewTransactions.TransactionsScreen.title") }}
        component={TransactionsScreen}
        name="ViewTransactions.TransactionsScreen"
      />
      <Stack.Screen
        options={{ title: t("ViewTransactions.PendingTransactionsScreen.title") }}
        component={PendingTransactionsScreen}
        name="ViewTransactions.PendingTransactionsScreen"
      />
      <Stack.Screen
        options={{ title: t("ViewTransactions.SingleTransactionDetailedScreen.title") }}
        component={SingleTransactionDetailedScreen}
        name="ViewTransactions.SingleTransactionDetailedScreen"
      />
    </Stack.Navigator>
  );
}
