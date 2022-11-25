import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ApplyForCardScreen } from "@/features/Cards";
import { HomeDashboardScreen } from "@/features/Home";

import RouteParams from "./RouteParams";

const Stack = createNativeStackNavigator<RouteParams>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={HomeDashboardScreen} name="Home.Dashboard" />
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen component={ApplyForCardScreen} name="Cards.ApplyForCard" />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
