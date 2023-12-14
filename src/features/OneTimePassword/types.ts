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
  isOtpAlreadySent?: boolean;
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
  | "cust_onboarding"
  | "change-passcode"
  | "create-passcode"
  | "customers/communication-details"
  | "payments/sadad"
  | "register-email"
  | "link-proxy-alias"
  | "optout-proxy-alias"
  | "goals/submit"
  | "goals/gold/submit"
  | "goals"
  | "mutual-fund/otp-validation"
  | "aio-card/issuance/otp-validation"
  | "aio-card/currencies/otp-validation"
  | "gold/otps/validate"
  | "aio-card/physical-card/otp-validation"
  | "aio-card/pin-change/otp-validation"
  | "mutual-fund/otps/validate"
  | "mutual-fund/subscribe/validate"
  | "aio-card/closure/validate"
  | "goal-gold-collect"
  | "goal-saving-pot-withdraw"
  | "goal-saving-pot-add-money"
  | "goal-delete"
  | "mutual-fund-subscribe";

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
  correlationId?: string;
}

export interface ValidateOnboardingOtpResponse {
  Status:
    | "OTP_CODE_MISMATCH"
    | "LIMIT_OF_GENERATING_OTP_HAS_BEEN_REACHED"
    | "OTP_MATCH_SUCCESS"
    | "THE_OTP_IS_EXPIRED_OR_DOES_NOT_EXIST";
  NumOfAttempts: number;
}

// TODO:  Need to remove/refactor this modal as currently mocked and actual service is integrated and later on mocked will be removed.
export interface ValidateOtpResponse {
  IsOtpValid: boolean;
  Status: string;
  data: {
    IsOtpValid: boolean;
    description: string;
    numOfAttempts: number;
    transactionID: string;
  };
}

export interface ApiOnboardingTasksResponse {
  Tasks: Array<{ Id: string; Name: string }>;
}
