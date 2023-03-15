import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingSingleCardScreen from "./screens/LoadingSingleCardScreen";
import OneTimePasswordModal from "./screens/OneTimePasswordModal";
import SingleUseCardAbout from "./screens/SingleUseCardAbout";
import SingleUseCardInfo from "./screens/SingleUseCardsInfo";
import { CardStatus, CardType, DetailedCardResponse } from "./types";

type CardAction =
  | "view-pin"
  | "freeze"
  | "unfreeze"
  | "activate-online-payment"
  | "generate-single-use-card"
  | "show-details";

type Otp = {
  otpId: string;
  otpCode: string;
  phoneNumber: string;
};

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    action?: CardAction;
    cardType: CardType;
    cardStatus?: CardStatus;
    cardId: string;
    pin?: string;
    detailedCardResponse?: DetailedCardResponse;
  };
  "CardActions.CardSettingsScreen": {
    cardStatus?: CardStatus;
  };
  "CardActions.LoadingSingleCardScreen": undefined;
  "CardActions.SingleUseCardInfo": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.HomeScreen": {
    action?: CardAction;
    pin?: string;
  };
  "CardActions.OneTimePasswordModal": {
    action: CardAction;
    cardType?: CardType;
    cardId: string;
    otp: Otp;
    redirect: keyof CardActionsStackParams;
    correlationId: string;
  };
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
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
