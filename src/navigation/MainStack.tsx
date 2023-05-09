import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMoneyStack from "@/features/AddMoney/AddMoneyStack";
import CardActionsStack from "@/features/CardActions/CardActionsStack";
import FrequentlyAskedQuestionsStack from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import HelpAndSupportStack from "@/features/HelpAndSupport/HelpAndSupportStack";
import HomeStack from "@/features/Home/HomeStack";
import InternalTransfersStack from "@/features/InternalTransfers/InternalTransfersStack";
import NotificationManagementStack from "@/features/NotificationManagement/NotificationManagementStack";
import OnboardingStack from "@/features/Onboarding/OnboardingStack";
import OneTimePasswordModal from "@/features/OneTimePassword/screens/OneTimePasswordModal";
import PaymentDisputesStack from "@/features/PaymentDisputes/PaymentDisputesStack";
import ReferralStack from "@/features/Referral/ReferralStack";
import InstructionsScreen from "@/features/Referral/screens/InstructionsScreen";
import TermsAndConditionsScreen from "@/features/Referral/screens/TermsAndConditionsScreen";
import SavingsGoalsStack from "@/features/SavingsGoals/SavingsGoalsStack";
import SettingsScreen from "@/features/Settings/screens/SettingsScreen";
import TemporaryDummyScreen from "@/features/Temporary/TemporaryDummyScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";
import ViewTransactionsStack from "@/features/ViewTransactions/ViewTransactionsStack";
import WhatsNextStack from "@/features/WhatsNext/WhatsNextStack";

import MainStackParams from "./mainStackParams";

const Stack = createNativeStackNavigator<MainStackParams>();

interface MainStackProps {
  onReady: () => void;
}

export default function MainStack({ onReady }: MainStackProps) {
  return (
    <NavigationContainer onReady={onReady}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={TemporaryLandingScreen} name="Temporary.LandingScreen" />
        <Stack.Screen component={TemporaryDummyScreen} name="Temporary.DummyScreen" />
        <Stack.Screen component={SettingsScreen} name="Settings.SettingsScreen" />
        <Stack.Screen component={ReferralStack} name="Referral.ReferralStack" />
        <Stack.Screen
          component={TermsAndConditionsScreen}
          name="Referral.TermsAndConditionsScreen"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen component={InstructionsScreen} name="Referral.InstructionsScreen" />
        <Stack.Screen component={CardActionsStack} name="CardActions.CardActionsStack" />
        <Stack.Screen component={AddMoneyStack} name="AddMoney.AddMoneyStack" />
        <Stack.Screen component={InternalTransfersStack} name="InternalTransfers.InternalTransfersStack" />
        <Stack.Screen component={SavingsGoalsStack} name="SavingsGoals.SavingsGoalsStack" />
        <Stack.Screen component={ViewTransactionsStack} name="ViewTransactions.ViewTransactionsStack" />
        <Stack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
        <Stack.Screen component={HomeStack} name="Home.HomeStack" />
        <Stack.Screen
          component={FrequentlyAskedQuestionsStack}
          name="FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack"
        />
        <Stack.Screen
          component={NotificationManagementStack}
          name="NotificationManagement.NotificationManagementStack"
        />
        <Stack.Screen component={WhatsNextStack} name="WhatsNext.WhatsNextStack" />
        <Stack.Screen component={HelpAndSupportStack} name="HelpAndSupport.HelpAndSupportStack" />
        <Stack.Screen
          component={OneTimePasswordModal}
          name="OneTimePassword.OneTimePasswordModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          component={PaymentDisputesStack}
          name="PaymentDisputes.PaymentDisputesStack"
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
