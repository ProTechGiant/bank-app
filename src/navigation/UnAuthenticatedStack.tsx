import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import OneTimePasswordModal from "@/features/OneTimePassword/screens/OneTimePasswordModal";
import SignInStack from "@/features/SignIn/SignInStack";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";
import useNavigation from "@/navigation/use-navigation";

import UnAuthenticatedStackParams from "./UnAuthenticatedStackParams";

const UnauthStack = createNativeStackNavigator<UnAuthenticatedStackParams>();

export const UnauthenticatedScreens = () => {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { isUserLocked } = useAuthContext();

  useEffect(() => {
    if (!isUserLocked) {
      return;
    }

    navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Passcode" });
  }, [isUserLocked, navigation]);

  return (
    <UnauthStack.Navigator screenOptions={{ headerShown: false }}>
      <UnauthStack.Screen component={TemporaryLandingScreen} name="Onboarding.OnboardingStack.temporary" />
      <UnauthStack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
      <UnauthStack.Screen component={SignInStack} name="SignIn.SignInStack" />
      <UnauthStack.Screen component={OneTimePasswordModal} name="OneTimePassword.OneTimePasswordModal" />
    </UnauthStack.Navigator>
  );
};
