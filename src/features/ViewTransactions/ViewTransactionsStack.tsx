import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { palette } from "@/theme/values";

import {
  CategoriesListScreen,
  PendingTransactionsScreen,
  SingleTransactionDetailedScreen,
  TransactionsScreen,
} from "./screens/";
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
    mutationStatus?: string;
    similarTransactions?: any;
  };
  "ViewTransactions.CategoriesListScreen": {
    categoryId: string;
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
        options={{ headerShown: false }}
        component={SingleTransactionDetailedScreen}
        name="ViewTransactions.SingleTransactionDetailedScreen"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={CategoriesListScreen}
        name="ViewTransactions.CategoriesListScreen"
      />
    </Stack.Navigator>
  );
}
