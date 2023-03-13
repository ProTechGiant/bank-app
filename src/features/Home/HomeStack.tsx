import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LayoutContextProvider } from "./contexts/LayoutContext";
import AccountDetailsScreen from "./screens/AccountDetails";
import DashboardScreen from "./screens/DashboardScreen";
import QuickActionsReordererModal from "./screens/QuickActionsReorderModal";
import SectionsReordererModal from "./screens/SectionsReordererModal";

export type HomeStackParams = {
  "Home.DashboardScreen": undefined;
  "Home.SectionsReordererModal": undefined;
  "Home.QuickActionsReorderModal": undefined;
  "Home.AccountDetailsScreen": undefined;
};

export const Stack = createNativeStackNavigator<HomeStackParams>();

export default function HomeStack() {
  return (
    <LayoutContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardScreen} name="Home.DashboardScreen" />
        <Stack.Screen
          component={AccountDetailsScreen}
          name="Home.AccountDetailsScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          component={QuickActionsReordererModal}
          name="Home.QuickActionsReorderModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          component={SectionsReordererModal}
          name="Home.SectionsReordererModal"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </LayoutContextProvider>
  );
}
