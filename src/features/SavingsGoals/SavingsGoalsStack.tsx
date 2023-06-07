import { RouteProp, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { palette } from "@/theme/values";

import {
  AllTransactionsScreen,
  CreateGoalScreen,
  EditGoalModal,
  EditRecurringPaymentModal,
  FundGoalModal,
  GoalDetailsScreen,
  InstructionsScreen,
  SavingsGoalsScreen,
  TransactionDetailScreen,
  WithdrawGoalModal,
} from "./screens";
import { FundingType, SavingGoalTransaction } from "./types";

export type SavingsGoalsStackParams = {
  "SavingsGoals.InstructionsScreen": undefined;
  "SavingsGoals.TransactionDetailScreen": {
    data: SavingGoalTransaction;
    cardId: string;
    PotId: string;
    createDisputeUserId: string;
  };
  "SavingsGoals.AllTransactionsScreen": {
    PotId: string;
  };
  "SavingsGoals.SavingsGoalsScreen": {
    isGoalRemoved?: boolean;
  };
  "SavingsGoals.CreateGoalScreen": undefined;
  "SavingsGoals.GoalDetailsScreen": {
    PotId: string;
    redirectToFundingModal?: boolean;
    amountWithdrawn?: number;
    isRecurringPaymentRemoved?: boolean;
  };
  "SavingsGoals.FundGoalModal": {
    PotId: string;
    isFirstFunding?: boolean;
    step?: FundingType;
  };
  "SavingsGoals.WithdrawGoalModal": {
    PotId: string;
    withdrawAmount?: number;
  };
  "SavingsGoals.EditGoalModal": {
    PotId: string;
  };
  "SavingsGoals.EditRecurringPaymentModal": {
    PotId: string;
  };
};

export const Stack = createNativeStackNavigator<SavingsGoalsStackParams>();

export default function SavingsGoalsStack() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.SavingsGoalsStack">>();

  const initialRouteName =
    route?.params?.savingsPotsNumber === 0 ? "SavingsGoals.InstructionsScreen" : "SavingsGoals.SavingsGoalsScreen";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen component={InstructionsScreen} name="SavingsGoals.InstructionsScreen" />
      <Stack.Screen component={SavingsGoalsScreen} name="SavingsGoals.SavingsGoalsScreen" />
      <Stack.Screen component={AllTransactionsScreen} name="SavingsGoals.AllTransactionsScreen" />
      <Stack.Screen component={CreateGoalScreen} name="SavingsGoals.CreateGoalScreen" />
      <Stack.Screen component={FundGoalModal} name="SavingsGoals.FundGoalModal" options={{ presentation: "modal" }} />
      <Stack.Screen component={GoalDetailsScreen} name="SavingsGoals.GoalDetailsScreen" />

      <Stack.Screen
        component={WithdrawGoalModal}
        name="SavingsGoals.WithdrawGoalModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={EditGoalModal} name="SavingsGoals.EditGoalModal" options={{ presentation: "modal" }} />
      <Stack.Screen
        component={EditRecurringPaymentModal}
        name="SavingsGoals.EditRecurringPaymentModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={TransactionDetailScreen}
        name="SavingsGoals.TransactionDetailScreen"
        options={{
          headerStyle: { backgroundColor: palette.primaryBase },
          headerTintColor: palette["neutralBase-50"],
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
