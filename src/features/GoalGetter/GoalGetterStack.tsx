import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoalGetterContextProvider } from "./contexts/GoalGetterContext";
import {
  ContributionSavingPotScreen,
  ContributionScreen,
  CreateGoalScreen,
  EditGoalGetterScreen,
  GoalCreatedSuccessfullyScreen,
  GoalDashboardScreen,
  GoalGetterScreen,
  GoalMindScreen,
  ImageGalleryScreen,
  LatestTransactionsScreen,
  ManageGoalScreen,
  MatchProductsScreen,
  ReviewGoalScreen,
  RisksAppetiteScreen,
  SetGoldContributionScreen,
  ShapeGoalScreen,
  ShapeYourGoalScreen,
  TargetAmountScreen,
  TermsAndConditionsScreen,
} from "./screens";
import { GoalGetterStateType, TransactionItem } from "./types";

export const Stack = createNativeStackNavigator();

export type GoalGetterStackParams = {
  "GoalGetter.CreateGoalScreen": undefined;
  "GoalGetter.GoalsAndProducts": undefined;
  "GoalGetter.GoalDashboardScreen": undefined;
  "GoalGetter.ImageGallary": {
    screen: string;
    images: unknown;
  };
  "GoalGetter.TermsAndConditionsScreen": { productId?: string };
  "GoalGetter.GoalMindScreen": undefined;
  "GoalGetter.RisksAppetiteScreen": undefined;
  "GoalGetter.ManageGoal": { selectedImageURL?: string } | undefined;
  "GoalGetter.TargetAmountScreen": undefined;
  "GoalGetter.MatchProductsScreen": undefined;
  "GoalGetter.GoalCreatedSuccessfullyScreen": undefined;
  "GoalGetter.LatestTransactionsScreen": {
    transactions: TransactionItem[];
  };
  "GoalGetter.ReviewGoalScreen": { pendingGoalAttributes?: GoalGetterStateType } | undefined;
  "GoalGetter.EditGoalGetter": undefined;
  "GoalGetter.ShapeGoalScreen": undefined;
  "GoalGetter.ShapeYourGoalScreen": undefined;
  "GoalGetter.SetGoldContributionScreen": undefined;
  "GoalGetter.ContributionSavingPotScreen": undefined;
};

export default function GoalGetterStack() {
  return (
    <GoalGetterContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={GoalGetterScreen} name="GoalGetter.GoalsAndProducts" />
        <Stack.Screen component={ShapeGoalScreen} name="GoalGetter.ShapeGoalScreen" />
        <Stack.Screen component={GoalDashboardScreen} name="GoalGetter.GoalDashboardScreen" />
        <Stack.Screen component={ManageGoalScreen} name="GoalGetter.ManageGoal" />
        <Stack.Screen component={TargetAmountScreen} name="GoalGetter.TargetAmountScreen" />
        <Stack.Screen component={CreateGoalScreen} name="GoalGetter.CreateGoalScreen" />
        <Stack.Screen
          component={ImageGalleryScreen}
          name="GoalGetter.ImageGallary"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={GoalMindScreen} name="GoalGetter.GoalMindScreen" />
        <Stack.Screen component={RisksAppetiteScreen} name="GoalGetter.RisksAppetiteScreen" />
        <Stack.Screen component={ReviewGoalScreen} name="GoalGetter.ReviewGoalScreen" />
        <Stack.Screen component={LatestTransactionsScreen} name="GoalGetter.LatestTransactionsScreen" />
        <Stack.Screen component={TermsAndConditionsScreen} name="GoalGetter.TermsAndConditionsScreen" />
        <Stack.Screen component={ContributionScreen} name="GoalGetter.ContributionScreen" />
        <Stack.Screen component={GoalCreatedSuccessfullyScreen} name="GoalGetter.GoalCreatedSuccessfullyScreen" />
        <Stack.Screen component={MatchProductsScreen} name="GoalGetter.MatchProductsScreen" />
        <Stack.Screen component={EditGoalGetterScreen} name="GoalGetter.EditGoalGetter" />
        <Stack.Screen component={ShapeYourGoalScreen} name="GoalGetter.ShapeYourGoalScreen" />
        <Stack.Screen component={SetGoldContributionScreen} name="GoalGetter.SetGoldContributionScreen" />
        <Stack.Screen component={ContributionSavingPotScreen} name="GoalGetter.ContributionSavingPotScreen" />
      </Stack.Navigator>
    </GoalGetterContextProvider>
  );
}
