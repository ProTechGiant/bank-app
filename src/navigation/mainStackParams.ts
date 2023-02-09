import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";
import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "Home.Dashboard": undefined;
  "Temporary.LandingScreen": undefined;
  "Onboarding.OnboardingStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "Referral.HubScreen": undefined;
  "Referral.InstructionsScreen": undefined;
  "Settings.SettingsScreen": undefined;
  "SavingsGoals.SavingsGoalsStack": undefined;
};

type MainStackParams = RootStackParams & ApplyCardModalStackParams & OnboardingStackParams & SavingsGoalsStackParams;

export default MainStackParams;
