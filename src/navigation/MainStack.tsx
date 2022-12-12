import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyForCardScreen from "@/features/Cards/ApplyForCardScreen";
import ApplyForLuxCardScreen from "@/features/Cards/ApplyForLuxCardScreen";
import SecureMessageScreen from "@/features/Cards/SecureMessageScreen";
import CreateCardPinScreen from "@/features/Cards/CreateCardPinScreen";
import HomeDashboardScreen from "@/features/Home/HomeDashboardScreen";
import OnboardingIqamaInput from "@/screens/Onboarding/OnboardingIqamaInput";
import OnboardingSplashScreen from "@/screens/Onboarding/OnboardingSplashScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";
const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={TemporaryLandingScreen}
          name="Temporary.LandingScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={HomeDashboardScreen}
          name="Home.Dashboard"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={OnboardingSplashScreen}
          name="Onboarding.SplashScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen component={OnboardingIqamaInput} name="Onboarding.Iqama" options={{ headerShown: false }} />
        <Stack.Group screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
          <Stack.Screen component={ApplyForCardScreen} name="Cards.ApplyForCard" />
          <Stack.Screen
            options={{ animation: "default" }}
            component={ApplyForLuxCardScreen}
            name="Cards.ApplyForLuxCard"
          />
          <Stack.Screen options={{ animation: "default" }} component={CreateCardPinScreen} name="Cards.CreateCardPin" />
          <Stack.Screen options={{ animation: "default" }} component={SecureMessageScreen} name="Cards.SecureMessage" />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
