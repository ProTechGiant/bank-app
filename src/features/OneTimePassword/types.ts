export interface OtpChallengeParams {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
  correlationId: string;
}

export type OtpResponseStatus = "success" | "fail" | "cancel";
