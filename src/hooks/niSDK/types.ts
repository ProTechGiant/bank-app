// Ni SDK interface
export interface NIConnectionProperties {
  rootUrl: string;
  token: string;
}

export interface NIInputInterface {
  bankCode: string;
  cardIdentifierId: string;
  cardIdentifierType: string;
  connectionProperties: NIConnectionProperties;
  displayAttributes?: any;
}

export interface NICardDetailsResponse {
  clearPan: string;
  maskedPan: string;
  expiry: string;
  clearCVV2: string;
  cardholderName: string;
}

export interface NISuccessResponse {
  successMessage: string;
}

export interface NIErrorResponse {
  domain: string;
  code: string;
  message: string;
}

export interface NIGetCardSuccessResponse {
  clearPan: string;
  maskedPan: string;
  expiry: string;
  clearCVV2: string;
  cardholderName: string;
}

interface NICardDetailsCallback {
  (error: NIErrorResponse | null, res: NIGetCardSuccessResponse | null): void;
}

interface NIGenericCallback {
  (error: NIErrorResponse | null, res: string): void;
}

export interface NICardManagementInterface {
  getCardDetails(input: NIInputInterface | string, callback: NICardDetailsCallback): void;

  setPin(pin: string, input: NIInputInterface | string, callback: NIGenericCallback): void;

  verifyPin(pin: string, input: NIInputInterface | string, callback: NIGenericCallback): void;

  changePin(oldPin: string, newPin: string, input: NIInputInterface | string, callback: NIGenericCallback): void;
}

export interface NITokenDetails {
  Token: string;
  CreationTimeDate: string;
}
