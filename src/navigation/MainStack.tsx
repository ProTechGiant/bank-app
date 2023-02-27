import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyCardsStack from "@/features/ApplyCards/ApplyCardsStack";
import CardActionsStack from "@/features/CardActions/CardActionsStack";
import LandingPage from "@/features/FrequentlyAskedQuestions/screens/LandingPage";
import DashboardScreen from "@/features/Home/screens/DashboardScreen";
import HomepageReorderModal from "@/features/Home/screens/HomepageReorderModal";
import QuickActionsReorderCard from "@/features/Home/screens/QuickActionsReorderModal";
import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import HubScreen from "@/features/Referral/screens/HubScreen";
import InstructionsScreen from "@/features/Referral/screens/InstructionsScreen";
import TermsAndConditionsScreen from "@/features/Referral/screens/TermsAndConditionsScreen";
import SavingsGoalsStack from "@/features/SavingsGoals/SavingsGoalsStack";
import SettingsScreen from "@/features/Settings/screens/SettingsScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";

const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={TemporaryLandingScreen} name="Temporary.LandingScreen" />
        <Stack.Screen component={DashboardScreen} name="Home.Dashboard" />
        <Stack.Screen component={SettingsScreen} name="Settings.SettingsScreen" />
        <Stack.Screen component={HubScreen} name="Referral.HubScreen" />
        <Stack.Screen
          component={TermsAndConditionsScreen}
          name="Referral.TermsAndConditions"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={InstructionsScreen} name="Referral.InstructionsScreen" />
        <Stack.Screen component={CardActionsStack} name="CardActions.CardActionsStack" />
        <Stack.Screen component={SavingsGoalsStack} name="SavingsGoals.SavingsGoalsStack" />
        <Stack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
        <Stack.Group screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen component={ApplyCardsStack} name="ApplyCards.ApplyForCardStack" />
          <Stack.Screen component={QuickActionsReorderCard} name="Modal.QuickActionsReorderModal" />
          <Stack.Screen component={HomepageReorderModal} name="Modal.HomepageReorderModal" />
        </Stack.Group>
        <Stack.Screen component={LandingPage} name="FrequentlyAskedQuestions.LandingPage" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
