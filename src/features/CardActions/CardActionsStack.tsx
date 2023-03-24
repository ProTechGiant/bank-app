import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainStackParams from "@/navigation/mainStackParams";
import { Address } from "@/types/Address";

import CardDetailsScreen from "./screens/CardDetailsScreen";
import CardSettingsScreen from "./screens/CardSettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import OneTimePasswordModal from "./screens/OneTimePasswordModal";
import ReportCardScreen from "./screens/ReportCardScreen";
import ReportCardSuccessScreen from "./screens/ReportCardScreen/ReportCardSuccessScreen";
import SetDifferentAddressScreen from "./screens/ReportCardScreen/SetDifferentAddressScreen";
import ResetPincodeScreen from "./screens/ResetPincodeScreen";
import SingleUseCardAbout from "./screens/SingleUseCardAbout";
import SingleUseCardInfoScreen from "./screens/SingleUseCardsInfoScreen";

interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  correlationId: string;
}

export type OtpResponseStatus = "success" | "fail";

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
  "CardActions.SetDifferentAddressScreen": {
    alternativeAddress?: Address;
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
      <Stack.Screen component={SingleUseCardInfoScreen} name="CardActions.SingleUseCardInfoScreen" />
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
      <Stack.Screen component={ReportCardScreen} name="CardActions.ReportCardScreen" />
      <Stack.Screen
        component={SetDifferentAddressScreen}
        name="CardActions.SetDifferentAddressScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={ReportCardSuccessScreen} name="CardActions.ReportCardSuccessScreen" />
    </Stack.Navigator>
  );
}
