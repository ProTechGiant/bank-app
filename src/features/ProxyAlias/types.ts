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

interface UserProxy {
  ProxyType: string;
  ProxyValue: string;
  RegistrationId: string;
  ARBProxyFlag: string;
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
  email: string;
}

export interface RegisterEmailResponse {
  Status: string;
  Message: string;
}

export interface OptOutResponse {
  Status: string;
  Message: string;
}

export interface OptOutInputs {
  OptOutReason: string;
}
