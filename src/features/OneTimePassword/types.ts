export type OtpFormType = "card-actions" | "internal-transfer";

export interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  otpFormType: OtpFormType;
}

export type OtpResponseStatus = "success" | "fail" | "cancel";

export interface OtpRequiredResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export interface ValidateOtpRequest<T extends object> {
  otpFormType: OtpFormType;
  OtpId: string;
  OtpCode: string;
  optionalParams: T;
}

export interface ValidateOtpResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
}
