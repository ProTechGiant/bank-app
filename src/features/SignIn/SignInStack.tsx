import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignInContextProvider } from "./contexts/SignInContext";
import { BiometricScreen, IqamaInputScreen, PasscodeScreen, UserBlockedScreen } from "./screens";
import ChangePasscodeScreen from "./screens/ChangePasscodeScreen";
import ConfirmPasscodeScreen from "./screens/ConfirmPasscodeScreen";
import CreatePasscodeScreen from "./screens/CreatePasscodeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

export type SignInStackParams = {
  "SignIn.Iqama": undefined;
  "SignIn.OptionalEmail": undefined;
  "SignIn.Passcode": undefined;
  "SignIn.UserBlocked": {
    type: "otp" | "passcode";
    timeInMs?: undefined | number;
  };
  "SignIn.OtpScreen": undefined;
  "SignIn.ForgotPassword": undefined;
  "SignIn.ChangePasscode": undefined;
  "SignIn.CreatePasscode": undefined;
  "SignIn.ConfirmPasscode": { passCode: string };
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
        <Stack.Screen component={BiometricScreen} name="SignIn.Biometric" />
      </Stack.Navigator>
    </SignInContextProvider>
  );
}
