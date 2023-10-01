import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { Address } from "@/types/Address";

import { OtpResponseStatus } from "../OneTimePassword/types";
import {
  ApplePayActivatedScreen,
  ApplyCardScreen,
  CardActivatedScreen,
  CardDetailsScreen,
  CardSettingsScreen,
  EnterCardCVVScreen,
  HomeScreen,
  OrderNewCardSummaryScreen,
  POSLimitScreen,
  ReportCardScreen,
  ResetPinCodeScreen,
  SetTemporaryAddressScreen,
  SingleUseCardAbout,
  SingleUseCardInfoScreen,
  WaitingVerificationCardScreen,
} from "./screens";
import { CardStatus } from "./types";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    cardId: string;
    isSingleUseCardCreated?: boolean;
  };
  "CardActions.WaitingVerificationCard": {
    title: string;
    message: string;
    cardId: string;
    callback: () => void;
  };
  "CardActions.CardSettingsScreen": {
    cardId: string;
    otpResponseStatus?: OtpResponseStatus;
    isPincodeUpdated?: boolean;
  };
  "CardActions.SingleUseCardInfoScreen": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.HomeScreen": undefined;
  "CardActions.ReportCardScreen": {
    cardId: string;
    cardStatus: CardStatus;
    alternativeAddress?: Address;
  };
  "CardActions.SetTemporaryAddressScreen": {
    initialValue?: Address;
    navigateTo: "CardActions.ApplyCardScreen" | "CardActions.ReportCardScreen";
  };
  "CardActions.ResetPincodeScreen": {
    cardId: string;
  };

  "CardActions.PickCardType": {
    cardId: string;
    productId: string;
  };
  "CardActions.CardOrdered": {
    cardId: string;
  };
  "CardActions.SetPinAndAddressScreen": {
    alternativeAddress?: Address;
    cardId: string;
  };
  "CardActions.AddToAppleWallet": {
    cardId: string;
  };

  "CardActions.CardOrderedScreen": {
    cardId: string;
  };

  "CardActions.ApplePayActivated": undefined;
  "CardActions.ApplyCardScreen":
    | {
        // for selecting alternative address
        alternativeAddress?: Address;

        // for replacing existing card
        replacingCardId?: string;
        productId?: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
      }
    | undefined;
  "CardActions.EnterCardCVVScreen": {
    cardId: string;
  };
  "CardActions.CardActivatedScreen": {
    cardId: string;
  };
  "CardActions.POSLimitScreen": undefined;
  "CardActions.OrderNewCardSummaryScreen": undefined;
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="CardActions.HomeScreen" />
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={WaitingVerificationCardScreen} name="CardActions.WaitingVerificationCard" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={SingleUseCardInfoScreen} name="CardActions.SingleUseCardInfoScreen" />
      <Stack.Screen component={ResetPinCodeScreen} name="CardActions.ResetPincodeScreen" />
      <Stack.Screen
        component={SingleUseCardAbout}
        name="CardActions.SingleUseCardAbout"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={ReportCardScreen} name="CardActions.ReportCardScreen" />
      <Stack.Screen
        component={SetTemporaryAddressScreen}
        name="CardActions.SetTemporaryAddressScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={ApplyCardScreen} name="CardActions.ApplyCardScreen" />
      <Stack.Screen component={ApplePayActivatedScreen} name="CardActions.ApplePayActivated" />
      <Stack.Screen component={EnterCardCVVScreen} name="CardActions.EnterCardCVVScreen" />
      <Stack.Screen component={CardActivatedScreen} name="CardActions.CardActivatedScreen" />
      <Stack.Screen component={POSLimitScreen} name="CardActions.POSLimitScreen" options={{ presentation: "modal" }} />
      <Stack.Screen
        component={OrderNewCardSummaryScreen}
        name="CardActions.OrderNewCardSummaryScreen"
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
