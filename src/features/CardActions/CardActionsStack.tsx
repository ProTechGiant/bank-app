import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { Address } from "@/types/Address";

import { OtpResponseStatus } from "../OneTimePassword/types";
import {
  ApplePayActivatedScreen,
  ApplyCardScreen,
  ApplyPhysicalCardSuccessScreen,
  CallBackVerificationScreen,
  CardActivatedScreen,
  CardDetailsScreen,
  CardSettingsScreen,
  CardToWalletScreen,
  CardToWalletSuccessScreen,
  ConfirmCardDeliveryAddress,
  EnterCardCVVScreen,
  HomeScreen,
  IVRCheckScreen,
  OrderNewCardSummaryScreen,
  POSLimitScreen,
  RenewCardScreen,
  ReportCardScreen,
  ResetPinCodeScreen,
  SetPinScreen,
  SetTemporaryAddressScreen,
  SingleUseCardAbout,
  SingleUseCardInfoScreen,
  VerifyPinScreen,
  WaitingVerificationCardScreen,
} from "./screens";
import RenewCardSuccessScreen from "./screens/RenewCardScreen/RenewCardSuccessScreen";
import { CardStatus } from "./types";

export type CardActionsStackParams = {
  "CardActions.CardDetailsScreen": {
    cardId: string;
    isSingleUseCardCreated?: boolean;
  };
  "CardActions.CardToWalletScreen": {
    cardId: string;
  };
  "CardActions.WaitingVerificationCard": {
    cardId: string;
  };
  "CardActions.CardSettingsScreen": {
    cardId: string;
    otpResponseStatus?: OtpResponseStatus;
    isPincodeUpdated?: boolean;
  };
  "CardActions.SingleUseCardInfoScreen": undefined;
  "CardActions.SingleUseCardAbout": undefined;
  "CardActions.CardToWalletSuccessScreen": undefined;
  "CardActions.HomeScreen": undefined;
  "CardActions.ReportCardScreen": {
    cardId: string;
    cardStatus: CardStatus;
    alternativeAddress?: Address;
  };
  "CardActions.SetTemporaryAddressScreen": {
    initialValue?: Address;
    navigateTo:
      | "CardActions.ApplyCardScreen"
      | "CardActions.ReportCardScreen"
      | "CardActions.ConfirmCardDeliveryAddress";
  };
  "CardActions.ResetPincodeScreen": {
    cardId: string;
    cardIdType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE | undefined;
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
    title?: string;
    message?: string;
  };
  "CardActions.SetPinScreen": {
    cardId: string;
  };
  "CardActions.IVRCheckScreen": {
    title: string;
    message: string;
    cardId: string;
    onVerificationComplete: () => void;
  };
  "CardActions.CallBackVerificationScreen": {
    cardId: string;
    pin: string;
    reason: "stolen" | "lost" | "Card fraud";
  };
  "CardActions.OrderNewCardSummaryScreen": { onDonePress: () => void };
  "CardActions.POSLimitScreen": { cardId: string };
  "CardActions.ConfirmCardDeliveryAddress": {
    cardId: string;
    cardType: string;
    cardHolderName: string;
    alternativeAddress?: Address;
  };

  "CardActions.ApplyPhysicalCardSuccessScreen": undefined;
  "CardActions.RenewCardScreen": {
    cardId: string;
  };
  "CardActions.RenewCardSuccessScreen": {
    cardId: string;
  };
  "CardActions.VerifyPinScreen": {
    title: string;
    message: string;
    cardId: string;
    onVerificationComplete: () => void;
  };
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export default function CardActionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="CardActions.HomeScreen" />
      <Stack.Screen component={CardDetailsScreen} name="CardActions.CardDetailsScreen" />
      <Stack.Screen component={WaitingVerificationCardScreen} name="CardActions.WaitingVerificationCard" />
      <Stack.Screen component={CardSettingsScreen} name="CardActions.CardSettingsScreen" />
      <Stack.Screen component={CardToWalletScreen} name="CardActions.CardToWalletScreen" />
      <Stack.Screen component={CardToWalletSuccessScreen} name="CardActions.CardToWalletSuccessScreen" />
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
      <Stack.Screen component={POSLimitScreen} name="CardActions.POSLimitScreen" />
      <Stack.Screen component={SetPinScreen} name="CardActions.SetPinScreen" />
      <Stack.Screen
        component={OrderNewCardSummaryScreen}
        name="CardActions.OrderNewCardSummaryScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={CallBackVerificationScreen} name="CardActions.CallBackVerificationScreen" />

      <Stack.Screen component={IVRCheckScreen} name="CardActions.IVRCheckScreen" />
      <Stack.Screen component={ConfirmCardDeliveryAddress} name="CardActions.ConfirmCardDeliveryAddress" />
      <Stack.Screen component={ApplyPhysicalCardSuccessScreen} name="CardActions.ApplyPhysicalCardSuccessScreen" />
      <Stack.Screen component={RenewCardScreen} name="CardActions.RenewCardScreen" />
      <Stack.Screen component={RenewCardSuccessScreen} name="CardActions.RenewCardSuccessScreen" />
      <Stack.Screen component={VerifyPinScreen} name="CardActions.VerifyPinScreen" />
    </Stack.Navigator>
  );
}
