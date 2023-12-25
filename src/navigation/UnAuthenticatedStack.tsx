import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { IvrWaitingScreen } from "@/features/Ivr/screens";
import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import OneTimePasswordModal from "@/features/OneTimePassword/screens/OneTimePasswordModal";
import SignInStack from "@/features/SignIn/SignInStack";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import UnAuthenticatedStackParams from "./UnAuthenticatedStackParams";

const UnauthStack = createNativeStackNavigator<UnAuthenticatedStackParams>();

export const UnauthenticatedScreens = () => {
  return (
    <UnauthStack.Navigator screenOptions={{ headerShown: false }}>
      <UnauthStack.Screen component={TemporaryLandingScreen} name="Temporary.LandingScreen" />
      <UnauthStack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
      <UnauthStack.Screen component={SignInStack} name="SignIn.SignInStack" />
      <UnauthStack.Screen component={OneTimePasswordModal} name="OneTimePassword.OneTimePasswordModal" />
      <UnauthStack.Screen component={IvrWaitingScreen} name="Ivr.IvrWaitingScreen" />
    </UnauthStack.Navigator>
  );
};
