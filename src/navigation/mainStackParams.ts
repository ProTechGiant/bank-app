import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { FrequentlyAskedQuestionsStackParams } from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import { HelpAndSuportStackParams } from "@/features/HelpAndSupport/HelpAndSupportStack";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { NotificationManagementStackParams } from "@/features/NotificationManagement/NotificationManagementStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { PaymentDisputesStackParams } from "@/features/PaymentDisputes/PaymentDisputesStack";
import { ReferralStackParams } from "@/features/Referral/ReferralStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";
import { WhatsNextStackParams } from "@/features/WhatsNext/WhatsNextStack";

type RootStackParams = {
  "CardActions.CardActionsStack": {
    screen: string;
  };
  "Home.HomeStack": undefined;
  "AddMoney.AddMoneyStack": {
    screen: string;
  };
  "InternalTransfers.InternalTransfersStack": {
    screen: string;
  };
  "Temporary.LandingScreen": undefined;
  "Temporary.DummyScreen": undefined;
  "Onboarding.OnboardingStack": undefined;
  "Referral.ReferralStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "NotificationManagement.NotificationManagementStack": undefined;
  "Settings.SettingsScreen": undefined;
  "SavingsGoals.SavingsGoalsStack": {
    savingsPotsNumber: number;
  };
  "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack": undefined;
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
  "WhatsNext.WhatsNextStack": undefined;
  "HelpAndSupport.HelpAndSupportStack": { screen: string } | undefined;
  "OneTimePassword.OneTimePasswordModal": {
    action: {
      to: keyof MainStackParams;
      params: Omit<MainStackParams[keyof MainStackParams], "otpResponseStatus" | "otpResponsePayload">;
    };
    otpOptionalParams?: Record<string, unknown> | undefined;
    otpChallengeParams?: OtpChallengeParams;
    onOtpRequest: () => Promise<OtpChallengeParams>;
    otpVerifyMethod: "card-actions" | "internal-transfers";
  };
  "PaymentDisputes.PaymentDisputesStack": undefined;
};

type MainStackParams = RootStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  InternalTransfersStackParams &
  CardActionsStackParams &
  ReferralStackParams &
  HomeStackParams &
  FrequentlyAskedQuestionsStackParams &
  WhatsNextStackParams &
  NotificationManagementStackParams &
  HelpAndSuportStackParams &
  PaymentDisputesStackParams;

export default MainStackParams;
