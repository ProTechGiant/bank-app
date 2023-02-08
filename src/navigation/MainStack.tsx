import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyCardsStack from "@/features/ApplyCards/ApplyCardsStack";
import DashboardScreen from "@/features/Home/screens/DashboardScreen";
import HomepageReorderModal from "@/features/Home/screens/HomepageReorderModal";
import QuickActionsReorderCard from "@/features/Home/screens/QuickActionsReorderModal";
import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import HubScreen from "@/features/Referral/screens/HubScreen";
import InstructionsScreen from "@/features/Referral/screens/InstructionsScreen";
import CreateGoalScreen from "@/features/SavingsGoals/screens/CreateGoalScreen";
import SavingsGoalsLandingScreen from "@/features/SavingsGoals/screens/LandingScreen";
import SavingsGoalsScreen from "@/features/SavingsGoals/screens/SavingsGoalsScreen";
import SettingsScreen from "@/features/Settings/screens/SettingsScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./MainStackParams";

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
          component={DashboardScreen}
          name="Home.Dashboard"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={SettingsScreen}
          name="Settings.SettingsScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen component={HubScreen} name="Referral.HubScreen" options={{ headerShown: false }} />
        <Stack.Screen
          component={InstructionsScreen}
          name="Referral.InstructionsScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={SavingsGoalsLandingScreen}
          name="SavingsGoals.LandingScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={SavingsGoalsScreen}
          name="SavingsGoals.SavingsGoalsScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={CreateGoalScreen}
          name="SavingsGoals.CreateGoalScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" options={{ headerShown: false }} />
        <Stack.Group screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen component={ApplyCardsStack} name="ApplyCards.ApplyForCardStack" />

          <Stack.Screen
            options={{ headerShown: false }}
            component={QuickActionsReorderCard}
            name="Modal.QuickActionsReorderModal"
          />
          <Stack.Screen
            options={{ headerShown: false }}
            component={HomepageReorderModal}
            name="Modal.HomepageReorderModal"
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
