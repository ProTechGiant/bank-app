import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import LoadingSingleCardScreen from "./screens/LoadingSingleCardScreen";
import OneTimePasswordScreen from "./screens/OneTimePasswordScreen";
import SingleUseCardInfo from "./screens/SingleUseCardsInfo";
import SingleUseCardsScreen from "./screens/SingleUseCardsScreen";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": undefined;
  "CardActions.CardSettingsScreen": undefined;
  "CardActions.LoadingSingleCardScreen": undefined;
  "CardActions.OneTimePasswordScreen": undefined;
  "CardActions.SingleUseCardsScreen": undefined;
  "CardActions.SingleUseCardInfo": undefined;
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={OneTimePasswordScreen} name="CardActions.OneTimePasswordScreen" />
      <Stack.Screen component={SingleUseCardsScreen} name="CardActions.SingleUseCardsScreen" />
      <Stack.Screen component={SingleUseCardInfo} name="CardActions.SingleUseCardInfo" />
      <Stack.Screen component={LoadingSingleCardScreen} name="CardActions.LoadingSingleCardScreen" />
    </Stack.Navigator>
  );
}
