export interface ConfirmationInputs {
  confirmed: boolean;
}

export interface RegisterCustomerResponseApi {
  Status: string;
  Message: string;
}

export interface TermsAndConditionsResponseApi {
  TermsAndConditions: string;
}

export interface UserProxy {
  ProxyType: string;
  ProxyValue: string;
  RegistrationId: string;
  ARBProxyFlag: boolean;
  ARBMaskedIBAN?: string;
}

interface UserName {
  FirstName: string;
  SecondName: string;
  LastName: string;
}

export interface UserProxiesResponse {
  UserName: UserName;
  AccountNumber: string;
  UserProxies: UserProxy[];
}

export interface RegisterEmailInputs {
  Email: string;
}

export interface RegisterEmailResponse {
  Status: string;
  Message: string;
}

export interface OtpChallengeParams {
  OneTimePassword: OneTimePasswordParams;
}

interface OneTimePasswordParams {
  Length: number;
  TimeToLive: number;
  AllowedAttempts: number;
}
export interface OptOutResponse {
  Status: string;
  Message: string;
}

export interface OptOutInputs {
  OptOutReason: string;
}
