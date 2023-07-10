interface GenericOtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
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
