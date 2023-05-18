import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainStackParams from "@/navigation/mainStackParams";

import OneTimePasswordModal from "../OneTimePassword/screens/OneTimePasswordModal";
import { SignInContextProvider } from "./contexts/SignInContext";
import { BiometricScreen, IqamaInputScreen, PasscodeScreen, UserBlockedScreen } from "./screens";
import { ChangePasscodeScreen } from "./screens";
import { ConfirmPasscodeScreen } from "./screens";
import { CreatePasscodeScreen } from "./screens";
import { ForgotPasswordScreen } from "./screens";

interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  correlationId: string;
}

export type SignInStackParams = {
  "SignIn.Iqama": undefined;
  "SignIn.OptionalEmail": undefined;
  "SignIn.Passcode": undefined;
  "SignIn.UserBlocked": undefined;
  "SignIn.OtpScreen": undefined;
  "SignIn.ForgotPassword": undefined;
  "SignIn.ChangePasscode": undefined;
  "SignIn.CreatePasscode": undefined;
  "SignIn.ConfirmPasscode": { passCode: string };
  "OneTimePassword.OneTimePasswordModal": {
    action: {
      to: keyof MainStackParams;
      params: Omit<MainStackParams[keyof MainStackParams], "otpResponseStatus" | "otpResponsePayload">;
    };
    otpOptionalParams?: Record<string, unknown> | undefined;
    otpChallengeParams: OtpChallengeParams;
    onOtpRequestResend: () => Promise<OtpChallengeParams>;
  };
  "SignIn.Biometric": undefined;
};
export const Stack = createNativeStackNavigator<SignInStackParams>();

export default function SignInStack() {
  return (
    <SignInContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={IqamaInputScreen} name="SignIn.Iqama" />
        <Stack.Screen component={PasscodeScreen} name="SignIn.Passcode" />
        <Stack.Screen component={UserBlockedScreen} name="SignIn.UserBlocked" />
        <Stack.Screen component={ForgotPasswordScreen} name="SignIn.ForgotPassword" />
        <Stack.Screen component={ChangePasscodeScreen} name="SignIn.ChangePasscode" />
        <Stack.Screen component={CreatePasscodeScreen} name="SignIn.CreatePasscode" />
        <Stack.Screen component={ConfirmPasscodeScreen} name="SignIn.ConfirmPasscode" />
        <Stack.Screen component={OneTimePasswordModal} name="OneTimePassword.OneTimePasswordModal" />
        <Stack.Screen component={BiometricScreen} name="SignIn.Biometric" />
      </Stack.Navigator>
    </SignInContextProvider>
  );
}
