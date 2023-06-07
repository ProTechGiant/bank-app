import { OnboardingStackParams } from "@/features/Onboarding/OnboardingStack";
import { SignInStackParams } from "@/features/SignIn/SignInStack";

import OneTimePasswordModalParams from "./one-time-password-modal-params";

type UnAuthenticatedStackParams = SignInStackParams &
  OnboardingStackParams & {
    "OneTimePassword.OneTimePasswordModal": OneTimePasswordModalParams<UnAuthenticatedStackParams>;
    "SignIn.SignInStack":
      | {
          screen: keyof SignInStackParams;
        }
      | undefined;
    "Temporary.LandingScreen": undefined;
    "Temporary.DummyScreen": undefined;
    "Onboarding.OnboardingStack":
      | {
          screen: keyof OnboardingStackParams;
        }
      | undefined;
  };

export default UnAuthenticatedStackParams;
