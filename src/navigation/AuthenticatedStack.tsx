import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMoneyStack from "@/features/AddMoney/AddMoneyStack";
import CardActionsStack from "@/features/CardActions/CardActionsStack";
import DetailedScreen from "@/features/FrequentlyAskedQuestions/screens/DetailedScreen";
import SectionScreen from "@/features/FrequentlyAskedQuestions/screens/SectionScreen";
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
import AccountSettings from "@/features/Settings/screens/AccountSettings";
import SettingsScreen from "@/features/Settings/screens/SettingsScreen";
import SignInStack from "@/features/SignIn/SignInStack";
import TemporaryDummyScreen from "@/features/Temporary/TemporaryDummyScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";
import WhatsNextStack from "@/features/WhatsNext/WhatsNextStack";
import useLogoutAfterInactivity from "@/hooks/use-logout-after-inactivity";

import MainStackParams from "./mainStackParams";

const AuthStack = createNativeStackNavigator<MainStackParams>();

export const AuthenticatedScreens = () => {
  useLogoutAfterInactivity();
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={HomeStack} name="Home.HomeStack" />
      <AuthStack.Screen component={SettingsScreen} name="Settings.SettingsScreen" />
      <AuthStack.Screen component={AccountSettings} name="Settings.AccountSettings" />
      <AuthStack.Screen component={InstructionsScreen} name="Referral.InstructionsScreen" />
      <AuthStack.Screen component={CardActionsStack} name="CardActions.CardActionsStack" />
      <AuthStack.Screen component={AddMoneyStack} name="AddMoney.AddMoneyStack" />
      <AuthStack.Screen component={WhatsNextStack} name="WhatsNext.WhatsNextStack" />
      <AuthStack.Screen component={InternalTransfersStack} name="InternalTransfers.InternalTransfersStack" />
      <AuthStack.Screen component={SavingsGoalsStack} name="SavingsGoals.SavingsGoalsStack" />
      <AuthStack.Screen component={SectionScreen} name="FrequentlyAskedQuestions.SectionScreen" />
      <AuthStack.Screen component={DetailedScreen} name="FrequentlyAskedQuestions.DetailedScreen" />
      <AuthStack.Screen component={TemporaryLandingScreen} name="Temporary.LandingScreen" />
      <AuthStack.Screen component={TemporaryDummyScreen} name="Temporary.DummyScreen" />
      <AuthStack.Screen component={ReferralStack} name="Referral.ReferralStack" />
      <AuthStack.Screen
        component={TermsAndConditionsScreen}
        name="Referral.TermsAndConditionsScreen"
        options={{ presentation: "modal" }}
      />
      <AuthStack.Screen component={OnboardingStack} name="Onboarding.OnboardingStack" />
      <AuthStack.Screen component={SignInStack} name="SignIn.SignInStack" />
      <AuthStack.Screen
        component={OneTimePasswordModal}
        name="OneTimePassword.OneTimePasswordModal"
        options={{ presentation: "modal" }}
      />
      <AuthStack.Screen component={PaymentDisputesStack} name="PaymentDisputes.PaymentDisputesStack" />
      <AuthStack.Screen
        component={NotificationManagementStack}
        name="NotificationManagement.NotificationManagementStack"
      />
    </AuthStack.Navigator>
  );
};
