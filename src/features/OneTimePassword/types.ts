interface MockedOtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

interface UpdatedOtpChallengeParams {
  OneTimePassword: {
    Length: number;
    TimeToLive: number;
    AllowedAttempts: number;
  };
}

export type OtpChallengeParams = MockedOtpChallengeParams | UpdatedOtpChallengeParams;

export type OtpResponseStatus = "success" | "fail" | "cancel";

export interface OtpRequiredResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export interface ValidateOtpRequest<T> {
  OtpId: string;
  OtpCode: string;
  optionalParams: T;
}

export interface ValidateOtpResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
  Status: string;
}
