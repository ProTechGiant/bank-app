import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { DetailedFaq, FAQSection } from "@/features/FrequentlyAskedQuestions/types/frequentlyAskedQuestions";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { ReferralStackParams } from "@/features/Referral/ReferralStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";

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
  "Settings.SettingsScreen": undefined;
  "SavingsGoals.SavingsGoalsStack": {
    savingsPotsNumber: number;
  };
  "FrequentlyAskedQuestions.LandingPage": undefined;
  "FrequentlyAskedQuestions.SectionScreen": { data: FAQSection[]; title: string };
  "FrequentlyAskedQuestions.DetailedScreen": { data: DetailedFaq; title: string } | { faqId: string };
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
};

type MainStackParams = RootStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  InternalTransfersStackParams &
  CardActionsStackParams &
  ReferralStackParams &
  HomeStackParams;

export default MainStackParams;
