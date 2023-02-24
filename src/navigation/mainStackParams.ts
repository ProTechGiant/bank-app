import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";
import { SingleUseCardsStackParams } from "@/features/SingleUseCards/SingleUseCardsStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "CardActions.CardActionsStack": undefined;
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
  "SingleUseCards.SingleUseCardsStack": undefined;
  "FrequentlyAskedQuestions.LandingPage": undefined;
};

type MainStackParams = RootStackParams &
  ApplyCardModalStackParams &
  OnboardingStackParams &
  SavingsGoalsStackParams &
  SingleUseCardsStackParams &
  CardActionsStackParams;

export default MainStackParams;
