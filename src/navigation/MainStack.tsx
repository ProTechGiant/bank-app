import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyForCardScreen from "@/features/Cards/ApplyForCardScreen";
import HomeDashboardScreen from "@/features/Home/HomeDashboardScreen";
import OnboardingIqamaInput from "@/features/Onboarding/OnboardingIqamaInput";
import OnboardingSplashScreen from "@/features/Onboarding/OnboardingSplashScreen";
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
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen component={ApplyForCardScreen} name="Cards.ApplyForCard" />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
