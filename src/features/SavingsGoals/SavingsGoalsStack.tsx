import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateGoalScreen from "@/features/SavingsGoals/screens/CreateGoalScreen";
import FundGoalModal from "@/features/SavingsGoals/screens/FundGoalModal";
import GoalDetailsScreen from "@/features/SavingsGoals/screens/GoalDetailsScreen";
import InstructionsScreen from "@/features/SavingsGoals/screens/InstructionsScreen";
import ListGoalsScreen from "@/features/SavingsGoals/screens/ListGoalsScreen";

export type SavingsGoalsStackParams = {
  "SavingsGoals.InstructionsScreen": undefined;
  "SavingsGoals.ListGoalsScreen": undefined;
  "SavingsGoals.CreateGoalScreen": undefined;
  "SavingsGoals.GoalDetailsScreen": {
    SavingsPotId: string;
    redirectToFundingModal?: boolean;
  };
  "SavingsGoals.FundGoalModal": {
    SavingsPotId: string;
    isFirstFunding?: boolean;
  };
};

export const Stack = createNativeStackNavigator<SavingsGoalsStackParams>();

export default function SavingsGoalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={InstructionsScreen} name="SavingsGoals.InstructionsScreen" />
      <Stack.Screen component={ListGoalsScreen} name="SavingsGoals.ListGoalsScreen" />
      <Stack.Screen component={CreateGoalScreen} name="SavingsGoals.CreateGoalScreen" />
      <Stack.Screen component={FundGoalModal} name="SavingsGoals.FundGoalModal" options={{ presentation: "modal" }} />
      <Stack.Screen component={GoalDetailsScreen} name="SavingsGoals.GoalDetailsScreen" />
    </Stack.Navigator>
  );
}
