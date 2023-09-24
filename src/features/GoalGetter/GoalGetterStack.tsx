import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CreateGoalScreen, GoalGetterScreen, GoalMindScreen, ImageGalleryScreen, RisksAppetiteScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type GoalGetterStackParams = {
  "GoalGetter.CreateGoalScreen": { selectedImageURL?: string };
  "GoalGetter.GoalsAndProducts": undefined;
  "GoalGetter.ImageGallary": undefined;
  "GoalGetter.GoalMindScreen": undefined;
  "GoalGetter.RisksAppetiteScreen": undefined;
};

export default function GoalGetterStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={CreateGoalScreen} name="GoalGetter.CreateGoalScreen" />
      <Stack.Screen component={GoalGetterScreen} name="GoalGetter.GoalsAndProducts" />
      <Stack.Screen component={ImageGalleryScreen} name="GoalGetter.ImageGallary" options={{ presentation: "modal" }} />
      <Stack.Screen component={GoalMindScreen} name="GoalGetter.GoalMindScreen" />
      <Stack.Screen component={RisksAppetiteScreen} name="GoalGetter.RisksAppetiteScreen" />
    </Stack.Navigator>
  );
}
