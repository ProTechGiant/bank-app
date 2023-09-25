import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoalGetterContextProvider } from "./contexts/GoalGetterContext";
import {
  CreateGoalScreen,
  GoalDashboardScreen,
  GoalGetterScreen,
  GoalMindScreen,
  ImageGalleryScreen,
  RisksAppetiteScreen,
} from "./screens";

export const Stack = createNativeStackNavigator();

export type GoalGetterStackParams = {
  "GoalGetter.CreateGoalScreen": undefined;
  "GoalGetter.GoalsAndProducts": undefined;
  "GoalGetter.GoalDashboardScreen": undefined;
  "GoalGetter.ImageGallary": undefined;
  "GoalGetter.GoalMindScreen": undefined;
  "GoalGetter.RisksAppetiteScreen": undefined;
};

export default function GoalGetterStack() {
  return (
    <GoalGetterContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={GoalGetterScreen} name="GoalGetter.GoalsAndProducts" />
        <Stack.Screen component={CreateGoalScreen} name="GoalGetter.CreateGoalScreen" />
        <Stack.Screen
          component={ImageGalleryScreen}
          name="GoalGetter.ImageGallary"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={GoalMindScreen} name="GoalGetter.GoalMindScreen" />
        <Stack.Screen component={RisksAppetiteScreen} name="GoalGetter.RisksAppetiteScreen" />
        <Stack.Screen component={GoalDashboardScreen} name="GoalGetter.GoalDashboardScreen" />
      </Stack.Navigator>
    </GoalGetterContextProvider>
  );
}
