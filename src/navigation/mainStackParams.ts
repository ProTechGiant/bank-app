import { AddMoneyStackParams } from "@/features/AddMoney/AddMoneyStack";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { FrequentlyAskedQuestionsStackParams } from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import { HelpAndSupportStackParams } from "@/features/HelpAndSupport/HelpAndSupportStack";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { NotificationManagementStackParams } from "@/features/NotificationManagement/NotificationManagementStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { PaymentDisputesStackParams } from "@/features/PaymentDisputes/PaymentDisputesStack";
import { ReferralStackParams } from "@/features/Referral/ReferralStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";
import { ViewTransactionsStackParams } from "@/features/ViewTransactions/ViewTransactionsStack";
import { WhatsNextStackParams } from "@/features/WhatsNext/WhatsNextStack";

import { SignInStackParams } from "../features/SignIn/SignInStack";

type RootStackParams = {
  "CardActions.CardActionsStack": {
    screen?: keyof CardActionsStackParams;
  };
  "Home.HomeStack":
    | {
        screen: keyof HomeStackParams;
      }
    | undefined;
  "AddMoney.AddMoneyStack":
    | {
        screen: keyof AddMoneyStackParams;
      }
    | undefined;
  "InternalTransfers.InternalTransfersStack":
    | {
        screen: keyof InternalTransfersStackParams;
      }
    | undefined;
  "Temporary.LandingScreen": undefined;
  "Temporary.DummyScreen": undefined;
  "Onboarding.OnboardingStack":
    | {
        screen: keyof OnboardingStackParams;
      }
    | undefined;
  "Referral.ReferralStack": undefined;
  "SignIn.SignInStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "NotificationManagement.NotificationManagementStack": undefined;
  "ViewTransactions.ViewTransactionsStack": {
    screen: string;
    params: {
      cardId: string;
      createDisputeUserId: string;
    };
  };
  "Settings.SettingsScreen": undefined;
  "Settings.AccountSettings": undefined;
  "SavingsGoals.SavingsGoalsStack": {
    savingsPotsNumber: number;
  };
  "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack": undefined;
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
  "WhatsNext.WhatsNextStack": undefined;
  "HelpAndSupport.HelpAndSupportStack":
    | {
        screen: keyof HelpAndSupportStackParams;
      }
    | undefined;
  "OneTimePassword.OneTimePasswordModal": {
    action: {
      to: keyof MainStackParams;
      params: Omit<MainStackParams[keyof MainStackParams], "otpResponseStatus" | "otpResponsePayload">;
    };
    otpOptionalParams?: Record<string, unknown> | undefined;
    otpChallengeParams?: OtpChallengeParams;
    onOtpRequest: () => Promise<OtpChallengeParams>;
    otpVerifyMethod: "card-actions" | "internal-transfers" | "quick-transfers";
  };
  "PaymentDisputes.PaymentDisputesStack":
    | {
        screen: keyof PaymentDisputesStackParams;
      }
    | undefined;
};

type MainStackParams = RootStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  ViewTransactionsStackParams &
  InternalTransfersStackParams &
  CardActionsStackParams &
  ReferralStackParams &
  HomeStackParams &
  FrequentlyAskedQuestionsStackParams &
  WhatsNextStackParams &
  NotificationManagementStackParams &
  ReferralStackParams &
  PaymentDisputesStackParams &
  SignInStackParams &
  HelpAndSupportStackParams;

export default MainStackParams;
