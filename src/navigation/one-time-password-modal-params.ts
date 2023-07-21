import { OtpChallengeParams } from "@/features/OneTimePassword/types";

import AuthenticatedStackParams from "./AuthenticatedStackParams";
import UnAuthenticatedStackParams from "./UnAuthenticatedStackParams";

export default interface OneTimePasswordModalParams<T extends AuthenticatedStackParams | UnAuthenticatedStackParams> {
  action: {
    to: keyof T;
    params: Omit<T[keyof T], "otpResponseStatus" | "otpResponsePayload">;
  };
  otpVerifyMethod:
    | "card-actions"
    | "croatia-to-arb"
    | "internal-to-bank"
    | "ips-payment"
    | "login"
    | "sarie"
    | "reset-passcode"
    | "change-passcode"
    | "create-passcode";
  otpOptionalParams?: Record<string, unknown>;
  otpChallengeParams?: OtpChallengeParams;
  onOtpRequest: () => Promise<OtpChallengeParams>;
  onUserBlocked?: () => void;
}
