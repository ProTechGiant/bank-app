import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createElement } from "react";

import { BankAccountIcon, SettingsIcon, TransferHorizontalIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { PaymentsHubScreen } from "./screens";

const Tab = createBottomTabNavigator();

function MockHomeComponent() {
  return <Typography.Text>Home</Typography.Text>;
}

function MockSettingsComponent() {
  return <Typography.Text>Settings</Typography.Text>;
}

const icons = {
  Home: BankAccountIcon,
  Payments: TransferHorizontalIcon,
  Settings: SettingsIcon,
};

export default function PaymentsHubTabs() {
  const activeIconColor = useThemeStyles(theme => theme.palette.primaryBase);
  const inActiveIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          return createElement(icons[route.name], { color });
        },
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inActiveIconColor,
      })}>
      <Tab.Screen name="Home" component={MockHomeComponent} />
      <Tab.Screen name="Payments" component={PaymentsHubScreen} />
      <Tab.Screen name="Settings" component={MockSettingsComponent} />
    </Tab.Navigator>
  );
}
