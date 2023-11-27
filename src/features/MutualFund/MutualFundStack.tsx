import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  DiscoverProductsScreen,
  MutualFundDashboardScreen,
  MutualFundDetailsScreen,
  MutualFundEntryPointScreen,
  MutualFundOnboardingScreen,
  MutualFundOrderDetailsScreen,
  MutualFundOrderSummaryScreen,
  MutualFundSuccessfulOnboarding,
  MutualFundSuccessfulSubscription,
  PortfolioDetailsScreen,
  RiskAppetiteScreen,
  SubscriptionScreen,
  TermsAndConditionsScreen,
} from "./screens";
import { PortfolioPerformanceList, ProductKeyInformation } from "./types";

export const Stack = createNativeStackNavigator();

export type MutualFundStackParams = {
  "MutualFund.EntryPoint": undefined;
  "MutualFund.DiscoverProducts": undefined;
  "MutualFund.Dashboard": undefined;
  "MutualFund.Subscription": {
    ProductKeyInformation: ProductKeyInformation;
  };
  "MutualFund.TermsAndConditions": undefined;
  "MutualFund.PortfolioDetails": {
    PortfolioPerformanceName?: string;
    PortfolioPerformanceList?: PortfolioPerformanceList;
    PortfolioPerformanceLineChartColorIndex: number;
  };
  "MutualFund.MutualFundDetailsScreen": {
    id: string;
  };
  "MutualFund.MutualFundOrderSummaryScreen": undefined;
  "MutualFund.MutualFundOrderDetailsScreen": undefined;
  "MutualFund.MutualFundSuccessfulSubscription": undefined;
  "MutualFund.MutualFundOnboardingScreen": undefined;
  "MutualFund.RiskAppetiteScreen": { totalPages: number };
  "MutualFund.MutualFundSuccessfulOnboarding": undefined;
};

export default function MutualFundStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={MutualFundEntryPointScreen} name="MutualFund.EntryPoint" />
      <Stack.Screen component={MutualFundSuccessfulSubscription} name="MutualFund.MutualFundSuccessfulSubscription" />
      <Stack.Screen component={DiscoverProductsScreen} name="MutualFund.DiscoverProducts" />
      <Stack.Screen component={MutualFundDashboardScreen} name="MutualFund.Dashboard" />
      <Stack.Screen component={SubscriptionScreen} name="MutualFund.Subscription" />
      <Stack.Screen component={PortfolioDetailsScreen} name="MutualFund.PortfolioDetails" />
      <Stack.Screen component={TermsAndConditionsScreen} name="MutualFund.TermsAndConditions" />
      <Stack.Screen component={MutualFundDetailsScreen} name="MutualFund.MutualFundDetailsScreen" />
      <Stack.Screen component={MutualFundOrderSummaryScreen} name="MutualFund.MutualFundOrderSummaryScreen" />
      <Stack.Screen component={MutualFundOrderDetailsScreen} name="MutualFund.MutualFundOrderDetailsScreen" />
      <Stack.Screen component={MutualFundOnboardingScreen} name="MutualFund.MutualFundOnboardingScreen" />
      <Stack.Screen component={RiskAppetiteScreen} name="MutualFund.RiskAppetiteScreen" />
      <Stack.Screen component={MutualFundSuccessfulOnboarding} name="MutualFund.MutualFundSuccessfulOnboarding" />
    </Stack.Navigator>
  );
}
