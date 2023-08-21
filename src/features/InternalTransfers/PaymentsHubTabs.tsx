import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createElement } from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountBalanceWalletIcon, ContactSupportIcon, HomeIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import HelpAndSupportStack from "../HelpAndSupport/HelpAndSupportStack";
import { PaymentsHubScreen } from "./screens";

const Tab = createBottomTabNavigator();

function MockHomeComponent() {
  return <Typography.Text>Home</Typography.Text>;
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
        tabBarIcon: ({ color }) => {
          return createElement(icons[route.name], { color });
        },
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inActiveIconColor,
        tabBarStyle: {
          height: 60 + insets.bottom,
        },
        tabBarItemStyle: tabBarItemStyle,
      })}>
      <Tab.Screen name="Home" component={MockHomeComponent} />
      <Tab.Screen name="Payments" component={PaymentsHubScreen} />
      <Tab.Screen name="Support" component={HelpAndSupportStack} />
    </Tab.Navigator>
  );
}
