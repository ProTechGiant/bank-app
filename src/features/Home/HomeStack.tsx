import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomepageLayoutOrderContextProvider } from "./contexts/HomepageLayoutOrderContext";
import { AccountDetailsScreen, DashboardScreen, SectionsReordererModal } from "./screens";

export type HomeStackParams = {
  "Home.DashboardScreen": undefined;
  "Home.SectionsReordererModal": undefined;
  "Home.AccountDetailsScreen": undefined;
};

export const Stack = createNativeStackNavigator<HomeStackParams>();

export default function HomeStack() {
  return (
    <HomepageLayoutOrderContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardScreen} name="Home.DashboardScreen" />
        <Stack.Screen
          component={AccountDetailsScreen}
          name="Home.AccountDetailsScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          component={SectionsReordererModal}
          name="Home.SectionsReordererModal"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </HomepageLayoutOrderContextProvider>
  );
}
