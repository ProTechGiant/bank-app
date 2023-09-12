import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMoneyStack from "@/features/AddMoney/AddMoneyStack";
import AppreciationStack from "@/features/Appreciation/AppreciationStack";
import CardActionsStack from "@/features/CardActions/CardActionsStack";
import DocumentsStack from "@/features/Documents/DocumentsStack";
import FrequentlyAskedQuestionsStack from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import DetailedScreen from "@/features/FrequentlyAskedQuestions/screens/DetailedScreen";
import SectionScreen from "@/features/FrequentlyAskedQuestions/screens/SectionScreen";
import GoalGetterStack from "@/features/GoalGetter/GoalGetterStack";
import HelpAndSupportStack from "@/features/HelpAndSupport/HelpAndSupportStack";
import HomeTabs from "@/features/Home/HomeTabs";
import InternalTransfersStack from "@/features/InternalTransfers/InternalTransfersStack";
import NotificationManagementStack from "@/features/NotificationManagement/NotificationManagementStack";
import NotificationsStack from "@/features/Notifications/NotificationsStack";
import OneTimePasswordModal from "@/features/OneTimePassword/screens/OneTimePasswordModal";
import PaymentDisputesStack from "@/features/PaymentDisputes/PaymentDisputesStack";
import ProfileDetailsStack from "@/features/ProfileDetails/ProfileDetailsStack";
import ProxyAliasStack from "@/features/ProxyAlias/ProxyAliasStack";
import ReferralStack from "@/features/Referral/ReferralStack";
import InstructionsScreen from "@/features/Referral/screens/InstructionsScreen";
import TermsAndConditionsScreen from "@/features/Referral/screens/TermsAndConditionsScreen";
import SadadBillPaymentStack from "@/features/SadadBillPayment/SadadBillPaymentStack";
import SavingsGoalsStack from "@/features/SavingsGoals/SavingsGoalsStack";
import SettingsStack from "@/features/Settings/SettingsStack";
import {
  ChangePasscodeScreen,
  ConfirmPasscodeScreen,
  CreatePasscodeScreen,
  PasscodeScreen,
  UserBlockedScreen,
} from "@/features/SignIn/screens";
import StatementsStack from "@/features/Statements/StatementsStack";
import TopSpendingStack from "@/features/TopSpending/TopSpendingStack";
import ViewTransactionsStack from "@/features/ViewTransactions/ViewTransactionsStack";
import WhatsNextStack from "@/features/WhatsNext/WhatsNextStack";
import useLogoutAfterInactivity from "@/hooks/use-logout-after-inactivity";

import AuthenticatedStackParams from "./AuthenticatedStackParams";

const AuthStack = createNativeStackNavigator<AuthenticatedStackParams>();
const ChangePasscodeStack = createNativeStackNavigator<AuthenticatedStackParams>();

export const PasscodeStack = () => {
  return (
    <ChangePasscodeStack.Navigator screenOptions={{ headerShown: false }}>
      <ChangePasscodeStack.Screen component={ChangePasscodeScreen} name="SignIn.ChangePasscode" />
      <ChangePasscodeStack.Screen component={CreatePasscodeScreen} name="SignIn.CreatePasscode" />
      <ChangePasscodeStack.Screen component={ConfirmPasscodeScreen} name="SignIn.ConfirmPasscode" />
      <ChangePasscodeStack.Screen component={PasscodeScreen} name="SignIn.Passcode" />
      <ChangePasscodeStack.Screen component={UserBlockedScreen} name="SignIn.UserBlocked" />
    </ChangePasscodeStack.Navigator>
  );
};

export const AuthenticatedScreens = () => {
  useLogoutAfterInactivity();
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={HomeTabs} name="Home.HomeTabs" />
      <AuthStack.Screen component={SettingsStack} name="Settings.SettingsStack" />
      <AuthStack.Screen component={NotificationsStack} name="Notifications.NotificationsStack" />
      <AuthStack.Screen component={InstructionsScreen} name="Referral.InstructionsScreen" />
      <AuthStack.Screen component={CardActionsStack} name="CardActions.CardActionsStack" />
      <AuthStack.Screen component={AddMoneyStack} name="AddMoney.AddMoneyStack" />
      <AuthStack.Screen component={PasscodeStack} name="Passcode.ChangePasscodeStack" />
      <AuthStack.Screen component={WhatsNextStack} name="WhatsNext.WhatsNextStack" />
      <AuthStack.Screen component={AppreciationStack} name="Appreciation.AppreciationStack" />
      <AuthStack.Screen component={InternalTransfersStack} name="InternalTransfers.InternalTransfersStack" />
      <AuthStack.Screen component={SavingsGoalsStack} name="SavingsGoals.SavingsGoalsStack" />
      <AuthStack.Screen component={SectionScreen} name="FrequentlyAskedQuestions.SectionScreen" />
      <AuthStack.Screen component={DetailedScreen} name="FrequentlyAskedQuestions.DetailedScreen" />
      <AuthStack.Screen component={ReferralStack} name="Referral.ReferralStack" />
      <AuthStack.Screen component={ViewTransactionsStack} name="ViewTransactions.ViewTransactionsStack" />
      <AuthStack.Screen component={TopSpendingStack} name="TopSpending.TopSpendingStack" />
      <AuthStack.Screen component={ProfileDetailsStack} name="ProfileDetails.ProfileDetailsStack" />
      <AuthStack.Screen component={SadadBillPaymentStack} name="SadadBillPayments.SadadBillPaymentStack" />
      <AuthStack.Screen component={StatementsStack} name="Statements.StatementsStack" />
      <AuthStack.Screen component={DocumentsStack} name="Documents.DocumentsStack" />
      <AuthStack.Screen component={GoalGetterStack} name="GoalGetter.GoalGetterStack" />

      <AuthStack.Screen
        component={TermsAndConditionsScreen}
        name="Referral.TermsAndConditionsScreen"
        options={{ presentation: "modal" }}
      />
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
      <AuthStack.Screen component={HelpAndSupportStack} name="HelpAndSupport.HelpAndSupportStack" />
      <AuthStack.Screen
        component={FrequentlyAskedQuestionsStack}
        name="FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack"
      />
      <AuthStack.Screen component={ProxyAliasStack} name="ProxyAlias.ProxyAliasStack" />
    </AuthStack.Navigator>
  );
};
