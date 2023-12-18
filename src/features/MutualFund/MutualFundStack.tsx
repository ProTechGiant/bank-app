import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MutualFundContextProvider } from "./contexts/MutualFundContext";
import {
  DiscoverProductsScreen,
  MutualFundDashboardScreen,
  MutualFundDetailsScreen,
  MutualFundEntryPointScreen,
  MutualFundOnboardingScreen,
  MutualFundOrderDetailsScreen,
  MutualFundOrderSummaryScreen,
  MutualFundSubscriptionSummaryScreen,
  MutualFundSuccessfulOnboarding,
  MutualFundSuccessfulSubscription,
  PortfolioDetailsScreen,
  ProductDetails,
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
  "MutualFund.MutualFundDetailsScreen": undefined;
  "MutualFund.MutualFundOrderSummaryScreen": undefined;
  "MutualFund.MutualFundOrderDetailsScreen": undefined;
  "MutualFund.MutualFundSuccessfulSubscription": undefined;
  "MutualFund.MutualFundOnboardingScreen": undefined;
  "MutualFund.RiskAppetiteScreen": { totalPages: number };
  "MutualFund.MutualFundSuccessfulOnboarding": undefined;
  "MutualFund.ProductDetails": {
    id: number;
    code?: string;
  };
  "MutualFund.MutualFundSubscriptionSummaryScreen": undefined;
};

export default function MutualFundStack() {
  return (
    <MutualFundContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={MutualFundEntryPointScreen} name="MutualFund.EntryPoint" />
        <Stack.Screen component={DiscoverProductsScreen} name="MutualFund.DiscoverProducts" />
        <Stack.Screen component={MutualFundDashboardScreen} name="MutualFund.Dashboard" />
        <Stack.Screen component={SubscriptionScreen} name="MutualFund.Subscription" />
        <Stack.Screen component={PortfolioDetailsScreen} name="MutualFund.PortfolioDetails" />
        <Stack.Screen component={MutualFundDetailsScreen} name="MutualFund.MutualFundDetailsScreen" />
        <Stack.Screen component={TermsAndConditionsScreen} name="MutualFund.TermsAndConditions" />
        <Stack.Screen component={MutualFundOrderDetailsScreen} name="MutualFund.MutualFundOrderDetailsScreen" />
        <Stack.Screen component={MutualFundOnboardingScreen} name="MutualFund.MutualFundOnboardingScreen" />

        <Stack.Screen component={MutualFundSuccessfulOnboarding} name="MutualFund.MutualFundSuccessfulOnboarding" />
        <Stack.Screen component={RiskAppetiteScreen} name="MutualFund.RiskAppetiteScreen" />
        <Stack.Screen component={ProductDetails} name="MutualFund.ProductDetails" />
        <Stack.Screen
          component={MutualFundSubscriptionSummaryScreen}
          name="MutualFund.MutualFundSubscriptionSummaryScreen"
        />
        <Stack.Screen component={MutualFundSuccessfulSubscription} name="MutualFund.MutualFundSuccessfulSubscription" />
        <Stack.Screen component={MutualFundOrderSummaryScreen} name="MutualFund.MutualFundOrderSummaryScreen" />
      </Stack.Navigator>
    </MutualFundContextProvider>
  );
}
