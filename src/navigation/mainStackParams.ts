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
  "SavingsGoals.InstructionsScreen": undefined;
  "SavingsGoals.SavingsGoalsScreen": undefined;
  "SavingsGoals.CreateGoalScreen": undefined;
  "Settings.SettingsScreen": undefined;
};

type MainStackParams = RootStackParams & ApplyCardModalStackParams & OnboardingStackParams;

export default MainStackParams;
