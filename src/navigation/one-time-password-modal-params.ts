import { OtpChallengeParams, OtpVerifyMethodType } from "@/features/OneTimePassword/types";

import AuthenticatedStackParams from "./AuthenticatedStackParams";
import UnAuthenticatedStackParams from "./UnAuthenticatedStackParams";

export default interface OneTimePasswordModalParams<T extends AuthenticatedStackParams | UnAuthenticatedStackParams> {
  action: {
    to: keyof T;
    params: Omit<T[keyof T], "otpResponseStatus" | "otpResponsePayload">;
  };
  otpVerifyMethod: OtpVerifyMethodType;
  otpOptionalParams?: Record<string, unknown>;
  otpChallengeParams?: OtpChallengeParams;
  onOtpRequest: () => Promise<OtpChallengeParams>;
  onUserBlocked?: () => void | Promise<void>;
}
