import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "@/theme";

import {
  CategoriesListScreen,
  PendingTransactionsScreen,
  SelectTagScreen,
  SingleTransactionDetailedScreen,
  TransactionsScreen,
} from "./screens/";
import { SingleTagType, TransactionDetailed } from "./types";

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
  "ViewTransactions.SelectTagScreen": { transactionTags: Array<SingleTagType>; transactionId: string };
};

const Stack = createNativeStackNavigator<ViewTransactionsStackParams>();

export default function ViewTransactionsStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.palette.primaryBase },
        headerTintColor: theme.palette["neutralBase-50"],
        headerTitleAlign: "center",
        headerShown: true,
      }}>
      <Stack.Screen
        options={{ headerShown: false }}
        component={TransactionsScreen}
        name="ViewTransactions.TransactionsScreen"
      />
      <Stack.Screen
        options={{ headerShown: false }}
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
      <Stack.Screen
        options={{ headerShown: false }}
        component={SelectTagScreen}
        name="ViewTransactions.SelectTagScreen"
      />
    </Stack.Navigator>
  );
}
