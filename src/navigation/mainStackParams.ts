import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { DetailedFaq, FAQSection } from "@/features/FrequentlyAskedQuestions/types/frequentlyAskedQuestions";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { SubCategories } from "@/features/NotificationManagement/screens/HubScreen/types/notificationManagement";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "CardActions.CardActionsStack": {
    screen: string;
  };
  "Home.HomeStack": undefined;
  "AddMoney.AddMoneyStack": {
    screen: string;
  };
  "Temporary.LandingScreen": undefined;
  "Onboarding.OnboardingStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "Referral.HubScreen": undefined;
  "Referral.InstructionsScreen": undefined;
  "Referral.TermsAndConditions": undefined;
  "Settings.SettingsScreen": undefined;
  "SavingsGoals.SavingsGoalsStack": {
    savingsPotsNumber: number;
  };
  "FrequentlyAskedQuestions.LandingPage": undefined;
  "FrequentlyAskedQuestions.SectionScreen": { data: FAQSection[]; title: string };
  "FrequentlyAskedQuestions.DetailedScreen": { data: DetailedFaq; title: string };
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.SubcategoryScreen": { data: SubCategories[]; title: string };
};

type MainStackParams = RootStackParams &
  ApplyCardModalStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  CardActionsStackParams &
  HomeStackParams;

export default MainStackParams;
