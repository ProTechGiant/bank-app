import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoalGetterContextProvider } from "./contexts/GoalGetterContext";
import {
  CollectSummaryScreen,
  ContributionSavingPotScreen,
  ContributionScreen,
  CreateGoalScreen,
  EditGoalGetterScreen,
  EditGoalScreen,
  EmkanTempScreenScreen,
  GoalCreatedSuccessfullyScreen,
  GoalDashboardScreen,
  GoalGetterScreen,
  GoalManagementDetails,
  GoalMindScreen,
  GoalsEntryScreen,
  GoalsHubScreens,
  GoalSummaryScreen,
  GoldPendingScreen,
  ImageGalleryScreen,
  LatestTransactionsScreen,
  ManageGoalScreen,
  MatchProductsScreen,
  MutualFundPending,
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
  "GoalGetter.GoalsEntryScreen": undefined;
  "GoalGetter.GoalsHubScreens": undefined;
  "GoalGetter.GoalSummaryScreen": undefined;
  "GoalGetter.CollectSummaryScreen": undefined;
  "GoalGetter.GoalManagementDetails": {
    goalType: string;
  };
  "GoalGetter.EmkanTempScreen": undefined;
  "GoalGetter.MutualFundPending": undefined;
  "GoalGetter.GoldPending": undefined;
  "GoalGetter.EditGoalScreen": undefined;
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
        <Stack.Screen component={GoalsEntryScreen} name="GoalGetter.GoalsEntryScreen" />
        <Stack.Screen component={GoalsHubScreens} name="GoalGetter.GoalsHubScreens" />
        <Stack.Screen component={GoalManagementDetails} name="GoalGetter.GoalManagementDetails" />
        <Stack.Screen component={GoalSummaryScreen} name="GoalGetter.GoalSummaryScreen" />
        <Stack.Screen component={CollectSummaryScreen} name="GoalGetter.CollectSummaryScreen" />
        <Stack.Screen component={EmkanTempScreenScreen} name="GoalGetter.EmkanTempScreen" />
        <Stack.Screen component={MutualFundPending} name="GoalGetter.MutualFundPending" />
        <Stack.Screen component={GoldPendingScreen} name="GoalGetter.GoldPending" />
        <Stack.Screen component={EditGoalScreen} name="GoalGetter.EditGoalScreen" />
      </Stack.Navigator>
    </GoalGetterContextProvider>
  );
}
