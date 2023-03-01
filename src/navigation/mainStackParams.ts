import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { DetailedFaq, FAQSection } from "@/features/FrequentlyAskedQuestions/types/frequentlyAskedQuestions";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "Cards.HomeScreen": undefined;
  "CardActions.CardActionsStack": {
    screen: string;
  };
  "Home.Dashboard": undefined;
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
};

type MainStackParams = RootStackParams &
  ApplyCardModalStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  CardActionsStackParams;

export default MainStackParams;
