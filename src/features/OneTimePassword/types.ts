export interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

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
}
