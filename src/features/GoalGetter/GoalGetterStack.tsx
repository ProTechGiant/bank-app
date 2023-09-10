import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoalGetterScreen } from "./screens";

export const Stack = createNativeStackNavigator();

export type GoalGetterStackParams = {
  "GoalGetter.GoalsAndProducts": undefined;
};

export default function GoalGetterStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={GoalGetterScreen} name="GoalGetter.GoalsAndProducts" />
    </Stack.Navigator>
  );
}
