import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingSingleCardScreen from "./screens/LoadingSingleCardScreen";
import OneTimePasswordModal from "./screens/OneTimePasswordModal";
import SingleUseCardAbout from "./screens/SingleUseCardAbout";
import SingleUseCardInfo from "./screens/SingleUseCardsInfo";
import SingleUseCardsScreen from "./screens/SingleUseCardsScreen";

type CardAction = "view-pin" | "freeze" | "unfreeze";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    cardType: "standard" | "plus" | "single-use";
  };
  "CardActions.CardSettingsScreen": undefined;
  "CardActions.LoadingSingleCardScreen": undefined;
  "CardActions.SingleUseCardsScreen": undefined;
  "CardActions.SingleUseCardInfo": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.HomeScreen": {
    action?: CardAction;
  };
  "CardActions.OneTimePasswordModal": {
    redirect: string;
    action: CardAction;
  };
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={SingleUseCardsScreen} name="CardActions.SingleUseCardsScreen" />
      <Stack.Screen component={SingleUseCardInfo} name="CardActions.SingleUseCardInfo" />
      <Stack.Screen component={LoadingSingleCardScreen} name="CardActions.LoadingSingleCardScreen" />
      <Stack.Screen component={HomeScreen} name="CardActions.HomeScreen" />
      <Stack.Screen
        component={SingleUseCardAbout}
        name="CardActions.SingleUseCardAbout"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={OneTimePasswordModal}
        name="CardActions.OneTimePasswordModal"
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
