import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "Home.Dashboard": undefined;
  "Temporary.LandingScreen": undefined;
  "Onboarding.OnboardingStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "Referral.HubScreen": undefined;
  "Referral.InstructionsScreen": undefined;
  "SavingsGoals.LandingScreen": undefined;
  "SavingsGoals.SavingsGoalsScreen": undefined;
  "SavingsGoals.CreateGoalModal": undefined;
  "Settings.SettingsScreen": undefined;
};

type MainStackParams = RootStackParams & ApplyCardModalStackParams & OnboardingStackParams;

export default MainStackParams;
