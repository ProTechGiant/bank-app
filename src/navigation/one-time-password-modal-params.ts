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
    | "internal-transfers"
    | "quick-transfers"
    | "login"
    | "reset-passcode"
    | "change-passcode"
    | "create-passcode";
  otpOptionalParams?: Record<string, unknown> | undefined;
  otpChallengeParams?: OtpChallengeParams;
  onOtpRequest: () => Promise<OtpChallengeParams>;
  onUserBlocked?: () => void;
}
