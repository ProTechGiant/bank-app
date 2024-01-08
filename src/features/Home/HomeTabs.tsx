import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createElement } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CardIcon, GoalGetterIcon, SpendingIcon, SupportAgentIcon } from "@/assets/icons";
import { HomeTabIcon } from "@/assets/icons/HomeTabIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DashboardScreen } from "../AllInOneCard/screens";
import GoalGetterStack from "../GoalGetter/GoalGetterStack";
import HelpAndSupportStack from "../HelpAndSupport/HelpAndSupportStack";
import { TransfersLandingScreen } from "../InternalTransfers/screens";
import HomeStack from "./HomeStack";

export type BottomTabParamList = {
  Home: undefined;
  Spending: undefined;
  GoalGetter: undefined;
  Cards: undefined;
  Support: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const icons = {
  Home: HomeTabIcon,
  Spending: SpendingIcon,
  GoalGetter: GoalGetterIcon,
  Cards: CardIcon,
  Support: SupportAgentIcon,
};

const tabHiddenRoutes = ["HelpAndSupport.ChatScreen", "Home.AccountDetailsScreen"];

export default function HomeTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appRoute = useRoute();
  const {
    otherAioCardProperties: { isAioClosedPermanent },
  } = useAuthContext();

  const activeIconColor = useThemeStyles(theme => theme.palette.complimentBase);
  const inActiveIconColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);
  const tabBarItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: Platform.OS === "android" ? theme.spacing["8p"] : 0,
  }));

  function displayTab(route: RouteProp<BottomTabParamList>): "none" | "flex" {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
    return tabHiddenRoutes.includes(routeName) ? "none" : "flex";
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
          display: displayTab(route),
          height: Platform.OS === "android" ? 60 + insets.bottom : 45 + insets.bottom,
        },
        tabBarItemStyle: tabBarItemStyle,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: t("Home.HomeTabs.tabHome") }}
        listeners={{
          tabPress: e => {
            if (appRoute.name === "Home.HomeTabs" && appRoute.params !== undefined) {
              navigation.reset({ index: 0, routes: [{ name: "Home.HomeTabs" }] });
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Spending"
        component={TransfersLandingScreen}
        options={{ tabBarLabel: t("Home.HomeTabs.tabSpendings") }}
        listeners={{
          tabPress: e => {
            navigation.navigate("TopSpending.TopSpendingStack", {
              screen: "TopSpending.TopSpendingScreen",
            });
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name="GoalGetter"
        component={GoalGetterStack}
        listeners={{
          tabPress: e => {
            navigation.navigate("GoalGetter.GoalGetterStack", {
              screen: "GoalGetter.GoalDashboardScreen",
            });
            e.preventDefault();
          },
        }}
        options={{ tabBarLabel: t("Home.HomeTabs.tabGoalGetter"), unmountOnBlur: true }}
      />
      {!isAioClosedPermanent ? (
        <Tab.Screen name="Cards" component={DashboardScreen} options={{ tabBarLabel: t("Home.HomeTabs.tabCards") }} />
      ) : null}
      <Tab.Screen
        name="Support"
        component={HelpAndSupportStack}
        options={{ tabBarLabel: t("Home.HomeTabs.tabSupport") }}
      />
    </Tab.Navigator>
  );
}
