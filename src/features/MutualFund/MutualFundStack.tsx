import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  DiscoverProductsScreen,
  MutualFundDashboardScreen,
  MutualFundDetailsScreen,
  MutualFundEntryPointScreen,
  PortfolioDetailsScreen,
  SubscriptionScreen,
  TermsAndConditionsScreen,
} from "./screens";

export const Stack = createNativeStackNavigator();

export type MutualFundStackParams = {
  "MutualFund.EntryPoint": undefined;
  "MutualFund.DiscoverProducts": undefined;
  "MutualFund.Dashboard": undefined;
  "MutualFund.Subscription": undefined;
  "MutualFund.TermsAndConditions": undefined;
  "MutualFund.PortfolioDetails": {
    portfolioName: string;
  };
  "MutualFund.MutualFundDetailsScreen": undefined;
};

export default function MutualFundStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={MutualFundEntryPointScreen} name="MutualFund.EntryPoint" />
      <Stack.Screen component={DiscoverProductsScreen} name="MutualFund.DiscoverProducts" />
      <Stack.Screen component={MutualFundDashboardScreen} name="MutualFund.Dashboard" />
      <Stack.Screen component={SubscriptionScreen} name="MutualFund.Subscription" />
      <Stack.Screen component={PortfolioDetailsScreen} name="MutualFund.PortfolioDetails" />
      <Stack.Screen component={TermsAndConditionsScreen} name="MutualFund.TermsAndConditions" />
      <Stack.Screen component={MutualFundDetailsScreen} name="MutualFund.MutualFundDetailsScreen" />
    </Stack.Navigator>
  );
}
