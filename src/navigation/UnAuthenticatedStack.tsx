import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import SignInStack from "@/features/SignIn/SignInStack";
import TemporaryDummyScreen from "@/features/Temporary/TemporaryDummyScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";

const UnauthStack = createNativeStackNavigator<MainStackParams>();
export const UnauthenticatedScreens = () => {
  return (
    <UnauthStack.Navigator screenOptions={{ headerShown: false }}>
      <UnauthStack.Screen component={TemporaryLandingScreen} name="Temporary.LandingScreen" />
      <UnauthStack.Screen component={TemporaryDummyScreen} name="Temporary.DummyScreen" />
      <UnauthStack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
      <UnauthStack.Screen component={SignInStack} name="SignIn.SignInStack" />
    </UnauthStack.Navigator>
  );
};
