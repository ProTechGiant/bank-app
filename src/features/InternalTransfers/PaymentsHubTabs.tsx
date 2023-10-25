import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createElement } from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountBalanceWalletIcon, ContactSupportIcon, HomeIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import HelpAndSupportStack from "../HelpAndSupport/HelpAndSupportStack";
import { PaymentsHubScreen } from "./screens";

const Tab = createBottomTabNavigator();

function MockHomeComponent() {
  return <></>;
}

const icons = {
  Home: HomeIcon,
  Payments: AccountBalanceWalletIcon,
  Support: ContactSupportIcon,
};

export default function PaymentsHubTabs() {
  const insets = useSafeAreaInsets();

  const activeIconColor = useThemeStyles(theme => theme.palette["complimentBase+10"]);
  const inActiveIconColor = useThemeStyles(theme => theme.palette["neutralBase+10"]);
  const tabBarItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => {
          return createElement(icons[route.name as keyof typeof icons], { color });
        },
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inActiveIconColor,
        tabBarStyle: {
          height: 60 + insets.bottom,
        },
        tabBarItemStyle: tabBarItemStyle,
      })}>
      <Tab.Screen
        name="Home"
        component={MockHomeComponent}
        options={{ tabBarTestID: "InternalTransfers.PaymentsHub:HomeButton" }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsHubScreen}
        options={{ tabBarTestID: "InternalTransfers.PaymentsHub:PaymentsButton" }}
      />
      <Tab.Screen
        name="Support"
        component={HelpAndSupportStack}
        options={{ tabBarTestID: "InternalTransfers.PaymentsHub:SupportButton" }}
      />
    </Tab.Navigator>
  );
}
