import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createElement } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CardIcon, ContactSupportIcon, WalletIcon } from "@/assets/icons";
import { HomeTabIcon } from "@/assets/icons/HomeTabIcon";
import { useThemeStyles } from "@/theme";

import CardActionsStack from "../CardActions/CardActionsStack";
import HelpAndSupportStack from "../HelpAndSupport/HelpAndSupportStack";
import { PaymentsHubScreen } from "../InternalTransfers/screens";
import HomeStack from "./HomeStack";

export type BottomTabParamList = {
  Home: undefined;
  Transfer: undefined;
  Cards: undefined;
  Support: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const icons = {
  Home: HomeTabIcon,
  Transfer: WalletIcon,
  Cards: CardIcon,
  Support: ContactSupportIcon,
};

const tabHidddenRoutes = ["HelpAndSupport.ChatScreen"];

export default function HomeTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const activeIconColor = useThemeStyles(theme => theme.palette["complimentBase+10"]);
  const inActiveIconColor = useThemeStyles(theme => theme.palette["neutralBase+10"]);
  const tabBarItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
  }));

  function displayTab(route: RouteProp<BottomTabParamList>): "none" | "flex" {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
    return tabHidddenRoutes.includes(routeName) ? "none" : "flex";
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => {
          return createElement(icons[route.name], { color });
        },
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inActiveIconColor,
        tabBarStyle: {
          height: 60 + insets.bottom,
          display: displayTab(route),
        },
        tabBarItemStyle: tabBarItemStyle,
      })}>
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t("Home.HomeTabs.tabHome") }} />
      <Tab.Screen
        name="Transfer"
        component={PaymentsHubScreen}
        options={{ tabBarLabel: t("Home.HomeTabs.tabTransfer") }}
      />
      <Tab.Screen name="Cards" component={CardActionsStack} options={{ tabBarLabel: t("Home.HomeTabs.tabCards") }} />
      <Tab.Screen
        name="Support"
        component={HelpAndSupportStack}
        options={{ tabBarLabel: t("Home.HomeTabs.tabSupport") }}
      />
    </Tab.Navigator>
  );
}
