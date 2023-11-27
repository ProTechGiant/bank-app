import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { SignInContextProvider } from "./contexts/SignInContext";
import {
  BiometricScreen,
  CardPinScreen,
  IqamaInputScreen,
  PanicModeScreen,
  PasscodeScreen,
  UserBlockedScreen,
} from "./screens";
import ChangePasscodeScreen from "./screens/ChangePasscodeScreen";
import ConfirmPasscodeScreen from "./screens/ConfirmPasscodeScreen";
import CreatePasscodeScreen from "./screens/CreatePasscodeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import NafathAuthScreen from "./screens/NafathAuthScreen";

export type SignInStackParams = {
  "SignIn.Iqama": undefined;
  "SignIn.OptionalEmail": undefined;
  "SignIn.Passcode": {
    panicLogic?: boolean;
  };
  "SignIn.UserBlocked": {
    type: "otp" | "passcode";
    timeInMs?: number;
    navigateTo?: string;
  };
  "SignIn.OtpScreen": undefined;
  "SignIn.ForgotPassword": undefined;
  "SignIn.CardPin": undefined;
  "SignIn.ChangePasscode": undefined;
  "SignIn.CreatePasscode": {
    currentPassCode?: string;
  };
  "SignIn.ConfirmPasscode": { passCode: string; currentPassCode?: string };
  "SignIn.Biometric": undefined;
  "SignIn.NafathAuthScreen": undefined;
  "SignIn.PanicModeScreen": undefined;
};

export const Stack = createNativeStackNavigator<SignInStackParams>();

export type SignInStackParamsNavigationProp = NativeStackNavigationProp<SignInStackParams>;

export default function SignInStack() {
  return (
    <SignInContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={IqamaInputScreen} name="SignIn.Iqama" />
        <Stack.Screen component={PasscodeScreen} name="SignIn.Passcode" />
        <Stack.Screen component={UserBlockedScreen} name="SignIn.UserBlocked" />
        <Stack.Screen component={ForgotPasswordScreen} name="SignIn.ForgotPassword" />
        <Stack.Screen component={CardPinScreen} name="SignIn.CardPin" />
        <Stack.Screen component={ChangePasscodeScreen} name="SignIn.ChangePasscode" />
        <Stack.Screen component={CreatePasscodeScreen} name="SignIn.CreatePasscode" />
        <Stack.Screen component={ConfirmPasscodeScreen} name="SignIn.ConfirmPasscode" />
        <Stack.Screen component={BiometricScreen} name="SignIn.Biometric" />
        <Stack.Screen component={NafathAuthScreen} name="SignIn.NafathAuthScreen" />
        <Stack.Screen component={PanicModeScreen} name="SignIn.PanicModeScreen" />
      </Stack.Navigator>
    </SignInContextProvider>
  );
}
