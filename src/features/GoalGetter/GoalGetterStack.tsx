import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoalGetterScreen, ImageGalleryScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type GoalGetterStackParams = {
  "GoalGetter.GoalsAndProducts": undefined;
  "GoalGetter.ImageGallary": undefined;
};

export default function GoalGetterStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={GoalGetterScreen} name="GoalGetter.GoalsAndProducts" />
      <Stack.Screen component={ImageGalleryScreen} name="GoalGetter.ImageGallary" options={{ presentation: "modal" }} />
    </Stack.Navigator>
  );
}
