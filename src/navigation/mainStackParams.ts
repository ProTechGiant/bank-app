import { ApplyCardModalStackParams } from "@/features/ApplyCards/ApplyCardModalStack";

export type MainStackParams = {
  "ApplyCards.ApplyForCard": undefined;
  "ApplyCards.ApplyForLuxCard": undefined;
  "ApplyCards.SetTemporaryAddress": undefined;
  "ApplyCards.OrderCardModal": undefined;
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
  "Settings.SettingsScreen": undefined;
};

export type StackParams = MainStackParams & ApplyCardModalStackParams;

export default StackParams;
