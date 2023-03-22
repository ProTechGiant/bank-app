import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingSingleCardScreen from "./screens/LoadingSingleCardScreen";
import OneTimePasswordModal from "./screens/OneTimePasswordModal";
import ResetPincodeScreen from "./screens/ResetPincodeScreen";
import SingleUseCardAbout from "./screens/SingleUseCardAbout";
import SingleUseCardInfo from "./screens/SingleUseCardsInfo";
import { CardCreateResponse, CardSettingsInput, CardStatus, DetailedCardResponse } from "./types";

type OtpCardAction =
  | "view-pin"
  | "freeze"
  | "unfreeze"
  | "activate-online-payment"
  | "generate-single-use-card"
  | "show-details"
  | "update-settings";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    cardId: string;
    // ..
    action?: OtpCardAction;
    pin?: string; // action === "view-pin"
    detailedCardResponse?: DetailedCardResponse; // action === "show-details"
  };
  "CardActions.CardSettingsScreen": {
    cardId: string;
    isPincodeUpdated?: boolean;
  };
  "CardActions.LoadingSingleCardScreen": {
    cardCreateResponse?: CardCreateResponse;
  };
  "CardActions.SingleUseCardInfo": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.HomeScreen": {
    action?: OtpCardAction;
    pin?: string;
  };
  "CardActions.OneTimePasswordModal": {
    action: OtpCardAction;
    cardId?: string;
    cardSettings?: CardSettingsInput;
    otp: {
      otpId: string;
      otpCode: string;
      phoneNumber: string;
    };
    redirect: keyof CardActionsStackParams;
    correlationId: string;
  };
  "CardActions.ResetPincodeScreen": {
    cardId: string;
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
      <Stack.Screen component={ResetPincodeScreen} name="CardActions.ResetPincodeScreen" />
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
