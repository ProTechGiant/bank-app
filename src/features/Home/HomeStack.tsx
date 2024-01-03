import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomepageContentContextProvider } from "./contexts/HomepageContentContext";
import { AccountDetailsScreen, DashboardScreen, SectionsReordererModal } from "./screens";

export type HomeStackParams = {
  "Home.DashboardScreen": undefined;
  "Home.SectionsReordererModal": undefined;
  "Home.AccountDetailsScreen": undefined;
};

export const Stack = createNativeStackNavigator<HomeStackParams>();

export default function HomeStack() {
  return (
    <HomepageContentContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardScreen} name="Home.DashboardScreen" />
        <Stack.Screen component={AccountDetailsScreen} name="Home.AccountDetailsScreen" />
        <Stack.Screen
          component={SectionsReordererModal}
          name="Home.SectionsReordererModal"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </HomepageContentContextProvider>
  );
}
