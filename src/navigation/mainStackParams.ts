import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { FrequentlyAskedQuestionsStackParams } from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { NotificationManagementStackParams } from "@/features/NotificationManagement/NotificationManagementStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
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
  NotificationManagementStackParams;

export default MainStackParams;
