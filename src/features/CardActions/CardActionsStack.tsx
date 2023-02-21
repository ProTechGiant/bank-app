import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import OneTimePasswordScreen from "./screens/OneTimePasswordScreen";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": undefined;
  "CardActions.CardSettingsScreen": undefined;
  "CardActions.OneTimePasswordScreen": undefined;
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={OneTimePasswordScreen} name="CardActions.OneTimePasswordScreen" />
    </Stack.Navigator>
  );
}
