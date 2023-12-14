import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoldFinalDealResponseType, MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";

import { GoalGetterContextProvider } from "./contexts/GoalGetterContext";
import {
  BuyGoldScreen,
  CollectSummaryScreen,
  ContributionSavingPotScreen,
  ContributionScreen,
  CreateGoalScreen,
  EditGoalGetterScreen,
  EditGoalScreen,
  EmkanTempScreenScreen,
  ExtendGoal,
  GoalCreatedSuccessfullyScreen,
  GoalDashboardScreen,
  GoalDeleteSummaryScreen,
  GoalGetterScreen,
  GoalManagementDetails,
  GoalManagementSuccessfulScreen,
  GoalMindScreen,
  GoalsEntryScreen,
  GoalsHubScreens,
  GoalSummaryScreen,
  ImageGalleryScreen,
  LatestTransactionsScreen,
  ManageGoalScreen,
  MatchProductsScreen,
  MutualFundsActionScreen,
  ReviewGoalScreen,
  RisksAppetiteScreen,
  SavingPotActionScreen,
  SellGoldScreen,
  SetGoldContributionScreen,
  ShapeGoalScreen,
  ShapeYourGoalScreen,
  TargetAmountScreen,
  TermsAndConditionsScreen,
  TransactionsDetailsModal,
  TransactionsScreen,
} from "./screens";
import GoldPendingScreen from "./screens/GoldPendingScreen";
import { Goal, GoalGetterStateType, ProductTypeName, TransactionItem, TransactionType } from "./types";
import { SavingPotsType } from "./utils";

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
  "GoalGetter.GoalsHubScreen": {
    goalId: number;
    goalName: string;
    productType: ProductTypeName;
    goalImage: string;
    ProductId: string;
    accountNumber: string;
  };
  "GoalGetter.GoalSummaryScreen": {
    goal: Goal;
    productType: ProductTypeName;
    goalName: string;
    goalImage: string;
  };
  "GoalGetter.CollectSummaryScreen": {
    transactionType?: TransactionTypeEnum;
    walletId?: string;
    weight?: number;
    onDonePress: (finalDealData?: GoldFinalDealResponseType) => void;
    productType?: ProductTypeName;
  };
  "GoalGetter.GoalDeleteSummaryScreen": {
    goal: Goal;
    productType: ProductTypeName;
    goalName: string;
    goalImage: string;
    goalId: number;
  };
  "GoalGetter.GoalManagementDetails": {
    goalType: string;
    walletId: string;
    weight: number;
    type: ProductTypeName;
    measureUnit: MeasureUnitEnum;
    goal: Goal;
    goalName: string;
    goalImage: string;
    goalId?: number;
    contributionAmount: number;
    accountNumber: string;
  };
  "GoalGetter.EmkanTempScreen": undefined;
  "GoalGetter.GoldPending": {
    walletId: string;
    goldToMoneyRatio: number;
    initialContribution: number;
    recurringContribution: number;
    recurringFrequency: string;
    goalId: number;
  };
  "GoalGetter.EditGoalScreen": {
    goalId: number;
    goalName: string;
    targetAmount: number;
    targetDate: Date;
    goalType: string;
    contributionAmount: number;
    accountNumber: string;
  };
  "GoalGetter.ExtendGoal": {
    targetDate: Date;
    contributionMethods: string[];
    contributionAmount: number;
    recurringMethod: string;
    goalId: number;
  };
  "GoalGetter.BuyGoldScreen": {
    walletId: string;
    weight: number;
    type: TransactionTypeEnum;
    measureUnit: MeasureUnitEnum;
  };
  "GoalGetter.SavingPotActionScreen": {
    savingPotType: SavingPotsType;
    fromBalanceAmount: number;
    toBalanceAmount: number;
    goalId: number;
    productType: ProductTypeName;
  };
  "GoalGetter.MutualFundsActionScreen": {
    fromBalanceAmount: number;
    toBalanceAmount: number;
    goalId: number;
  };
  "GoalGetter.SellGoldScreen": {
    walletId: string;
    weight: number;
    type: TransactionTypeEnum;
    measureUnit: MeasureUnitEnum;
  };
  "GoalGetter.GoalManagementSuccessfulScreen": {
    title: string;
    subtitle: string;
    viewTransactions?: boolean;
    icon: JSX.Element;
  };
  "GoalGetter.TransactionsScreen": {
    goalId: number;
  };
  "GoalGetter.TransactionsDetailsModal": { transaction: TransactionType };
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
        <Stack.Screen component={GoalsHubScreens} name="GoalGetter.GoalsHubScreen" />
        <Stack.Screen component={GoalManagementDetails} name="GoalGetter.GoalManagementDetails" />
        <Stack.Screen component={GoalSummaryScreen} name="GoalGetter.GoalSummaryScreen" />
        <Stack.Screen component={CollectSummaryScreen} name="GoalGetter.CollectSummaryScreen" />
        <Stack.Screen component={GoalDeleteSummaryScreen} name="GoalGetter.GoalDeleteSummaryScreen" />
        <Stack.Screen component={EmkanTempScreenScreen} name="GoalGetter.EmkanTempScreen" />
        <Stack.Screen component={GoldPendingScreen} name="GoalGetter.GoldPending" />
        <Stack.Screen component={EditGoalScreen} name="GoalGetter.EditGoalScreen" />
        <Stack.Screen component={ExtendGoal} name="GoalGetter.ExtendGoal" />
        <Stack.Screen component={BuyGoldScreen} name="GoalGetter.BuyGoldScreen" />
        <Stack.Screen component={SellGoldScreen} name="GoalGetter.SellGoldScreen" />
        <Stack.Screen component={SavingPotActionScreen} name="GoalGetter.SavingPotActionScreen" />
        <Stack.Screen component={MutualFundsActionScreen} name="GoalGetter.MutualFundsActionScreen" />
        <Stack.Screen component={GoalManagementSuccessfulScreen} name="GoalGetter.GoalManagementSuccessfulScreen" />
        {/* TODO duplicated from gold wallet , it will be refactor later because BE return diffrent key value */}
        <Stack.Screen component={TransactionsScreen} name="GoalGetter.TransactionsScreen" />
        <Stack.Screen
          component={TransactionsDetailsModal}
          name="GoalGetter.TransactionsDetailsModal"
          options={{ presentation: "transparentModal" }}
        />
      </Stack.Navigator>
    </GoalGetterContextProvider>
  );
}
