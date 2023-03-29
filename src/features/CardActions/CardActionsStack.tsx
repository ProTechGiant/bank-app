import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import MainStackParams from "@/navigation/mainStackParams";
import { Address } from "@/types/Address";

import { OrderCardContextProvider } from "./context/OrderCardContext";
import {
  ApplePayActivatedScreen,
  CardDetailsScreen,
  CardSettingsScreen,
  HomeScreen,
  OneTimePasswordModal,
  PickCardTypeScreen,
  ReportCardScreen,
  ResetPinCodeScreen,
  SetTemporaryAddressScreen,
  SingleUseCardAbout,
  SingleUseCardInfoScreen,
} from "./screens";
import CardOrderedScreen from "./screens/ApplyCardsFlow/CardOrderedScreen";
import SetPinAndAddressScreen from "./screens/ApplyCardsFlow/SetPinAndAddressScreen";
import ReportCardSuccessScreen from "./screens/ReportCardFlow/ReportCardSuccessScreen";
import { OtpResponseStatus } from "./types";

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
    alternativeAddress?: Address;
  };
  "CardActions.ReportCardSuccessScreen": {
    cardId: string;
  };
  "CardActions.SetTemporaryAddressScreen": {
    initialValue?: Address;
    navigateTo: keyof CardActionsStackParams;
  };
  "CardActions.ResetPincodeScreen": {
    cardId: string;
  };
  "CardActions.PickCardType": undefined;
  "CardActions.CardOrderedScreen": {
    cardId: string;
  };
  "CardActions.SetPinAndAddress":
    | {
        alternativeAddress?: Address;
      }
    | undefined;
  "CardActions.ApplePayActivated": undefined;
  "ApplyCards.ApplyForCardStack": undefined;
};

export const Stack = createNativeStackNavigator<CardActionsStackParams>();

export function ApplyCardsStack() {
  return (
    <SafeAreaProvider>
      <OrderCardContextProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={PickCardTypeScreen} name="CardActions.PickCardType" />
          <Stack.Screen component={SetPinAndAddressScreen} name="CardActions.SetPinAndAddress" />
          <Stack.Screen component={CardOrderedScreen} name="CardActions.CardOrderedScreen" />
        </Stack.Navigator>
      </OrderCardContextProvider>
    </SafeAreaProvider>
  );
}

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
      <Stack.Screen component={ReportCardSuccessScreen} name="CardActions.ReportCardSuccessScreen" />
      <Stack.Screen component={ApplyCardsStack} name="ApplyCards.ApplyForCardStack" />
      <Stack.Screen component={ApplePayActivatedScreen} name="CardActions.ApplePayActivated" />
    </Stack.Navigator>
  );
}
