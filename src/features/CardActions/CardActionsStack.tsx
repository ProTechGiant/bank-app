import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import MainStackParams from "@/navigation/mainStackParams";
import { Address } from "@/types/Address";

import {
  ApplePayActivatedScreen,
  ApplyCardScreen,
  CardActivatedScreen,
  CardDetailsScreen,
  CardSettingsScreen,
  EnterCardCVVScreen,
  HomeScreen,
  OneTimePasswordModal,
  ReportCardScreen,
  ResetPinCodeScreen,
  SetTemporaryAddressScreen,
  SingleUseCardAbout,
  SingleUseCardInfoScreen,
} from "./screens";
import { CardStatus, OtpResponseStatus } from "./types";

interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  correlationId: string;
}

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    cardId: string;
    isSingleUseCardCreated?: boolean;
  };
  "CardActions.CardSettingsScreen": {
    cardId: string;
    otpResponseStatus?: OtpResponseStatus;
    isPincodeUpdated?: boolean;
  };
  "CardActions.SingleUseCardInfoScreen": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.HomeScreen": undefined;
  "CardActions.OneTimePasswordModal": {
    action: {
      to: keyof MainStackParams;
      params: Omit<MainStackParams[keyof MainStackParams], "otpResponseStatus" | "otpResponsePayload">;
    };
    otpOptionalParams?: Record<string, unknown> | undefined;
    otpChallengeParams: OtpChallengeParams;
    onOtpRequestResend: () => Promise<OtpChallengeParams>;
  };
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
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={SingleUseCardInfoScreen} name="CardActions.SingleUseCardInfoScreen" />
      <Stack.Screen component={HomeScreen} name="CardActions.HomeScreen" />
      <Stack.Screen component={ResetPinCodeScreen} name="CardActions.ResetPincodeScreen" />
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
    </Stack.Navigator>
  );
}
