import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardsStack";

type RootStackParams = {
  "ApplyCards.ApplyForCardStack": undefined;
  "Home.Dashboard": undefined;
  "Temporary.LandingScreen": undefined;
  "Onboarding.SplashScreen": undefined;
  "Onboarding.Iqama": undefined;
  "Onboarding.Nafath": undefined;
  "Onboarding.ConfirmDetails": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Onboarding.Financial": undefined;
  "Modal.HomepageReorderModal": undefined;
  "Onboarding.ForeignTax": undefined;
  "Onboarding.OptionalEmail": undefined;
  "Referral.HubScreen": undefined;
  "Referral.HowItWorksModal": undefined;
  "Referral.InstructionsScreen": undefined;
  "Settings.SettingsScreen": undefined;
};

type MainStackParams = RootStackParams & ApplyCardModalStackParams;

export default MainStackParams;
