interface GenericOtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  Email?: string;
  Status: boolean;
  oneTimePassword: {
    Length: number;
    TimeToLive: number;
    AllowedAttempts: number;
  };
}

interface UpdatedOtpChallengeParams {
  OneTimePassword: {
    Length: number;
    TimeToLive: number;
    AllowedAttempts: number;
  };
}

export type OtpChallengeParams = GenericOtpChallengeParams | UpdatedOtpChallengeParams;

export type OtpResponseStatus = "success" | "fail" | "cancel";

export type OtpVerifyMethodType =
  | "card-actions"
  | "croatia-to-arb"
  | "internal-to-bank"
  | "ips-payment"
  | "login"
  | "sarie"
  | "reset-passcode"
  | "change-passcode"
  | "create-passcode"
  | "customers/communication-details"
  | "payments/sadad"
  | "register-email"
  | "link-proxy-alias"
  | "optout-proxy-alias"
  | "goals/submit"
  | "mutual-fund/otp-validation";

export interface OtpRequiredResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  IsOtpRequired: boolean;
}

export interface ValidateOtpRequest<T> {
  OtpId: string;
  OtpCode: string;
  optionalParams: T;
}

// TODO:  Need to remove/refactor this modal as currently mocked and actual service is integrated and later on mocked will be removed.
export interface ValidateOtpResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
  Status: string;
  data: {
    IsOtpValid: boolean;
    description: string;
    numOfAttempts: number;
    transactionID: string;
  };
}
