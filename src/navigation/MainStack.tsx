import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMoneyStack from "@/features/AddMoney/AddMoneyStack";
import ApplyCardsStack from "@/features/ApplyCards/ApplyCardsStack";
import CardActionsStack from "@/features/CardActions/CardActionsStack";
import DetailedSceen from "@/features/FrequentlyAskedQuestions/screens/DetailedScreen";
import LandingPage from "@/features/FrequentlyAskedQuestions/screens/LandingPage";
import SectionScreen from "@/features/FrequentlyAskedQuestions/screens/SectionScreen";
import HomeStack from "@/features/Home/HomeStack";
import DashboardScreen from "@/features/Home/screens/DashboardScreen";
import NotificationManagementHubScreen from "@/features/NotificationManagement/screens/HubScreen";
import NotificationManagementSubcategoryScreen from "@/features/NotificationManagement/screens/SubcategoryScreen";
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
        <Stack.Screen component={AddMoneyStack} name="AddMoney.AddMoneyStack" />
        <Stack.Screen component={SavingsGoalsStack} name="SavingsGoals.SavingsGoalsStack" />
        <Stack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
        <Stack.Screen component={HomeStack} name="Home.HomeStack" />
        <Stack.Group screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen component={ApplyCardsStack} name="ApplyCards.ApplyForCardStack" />
        </Stack.Group>
        <Stack.Screen component={LandingPage} name="FrequentlyAskedQuestions.LandingPage" />
        <Stack.Screen component={SectionScreen} name="FrequentlyAskedQuestions.SectionScreen" />
        <Stack.Screen component={DetailedSceen} name="FrequentlyAskedQuestions.DetailedScreen" />
        <Stack.Screen component={NotificationManagementHubScreen} name="NotificationManagement.HubScreen" />
        <Stack.Screen
          component={NotificationManagementSubcategoryScreen}
          name="NotificationManagement.SubcategoryScreen"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
