import { RouteProp, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateGoalScreen from "@/features/SavingsGoals/screens/CreateGoalScreen";
import EditGoalModal from "@/features/SavingsGoals/screens/EditGoalModal";
import EditRecurringPaymentModal from "@/features/SavingsGoals/screens/EditRecurringPaymentModal";
import FundGoalModal from "@/features/SavingsGoals/screens/FundGoalModal";
import GoalDetailsScreen from "@/features/SavingsGoals/screens/GoalDetailsScreen";
import InstructionsScreen from "@/features/SavingsGoals/screens/InstructionsScreen";
import ListGoalsScreen from "@/features/SavingsGoals/screens/ListGoalsScreen";
import WithdrawGoalModal from "@/features/SavingsGoals/screens/WithdrawGoalModal";
import MainStackParams from "@/navigation/mainStackParams";

import { FundingType } from "./screens/FundGoalModal/FundingStep";

export type SavingsGoalsStackParams = {
  "SavingsGoals.InstructionsScreen": undefined;
  "SavingsGoals.ListGoalsScreen": {
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
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.SavingsGoalsStack">>();

  const initialRouteName =
    route.params.savingsPotsNumber === 0 ? "SavingsGoals.InstructionsScreen" : "SavingsGoals.ListGoalsScreen";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen component={InstructionsScreen} name="SavingsGoals.InstructionsScreen" />
      <Stack.Screen component={ListGoalsScreen} name="SavingsGoals.ListGoalsScreen" />
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
    </Stack.Navigator>
  );
}
