import { BiometryType } from "react-native-biometrics";

import { BiometricsInitiateDevicePayload } from "./biometrics.enums";

export interface IsSensorAvailableResult {
  available: boolean;
  biometryType?: BiometryType;
  error?: string;
  secure: boolean;
}
export interface CreateKeysResult {
  publicKey: string;
}
export interface BiometricKeysExistResult {
  keysExist: boolean;
}
export interface DeleteKeysResult {
  keysDeleted: boolean;
}
export interface CreateSignatureOptions {
  promptMessage: string;
  payload: string;
  cancelButtonText?: string;
  requestFrom: string;
}
export interface CreateSignatureResult {
  success: boolean;
  signature?: string;
  error?: string;
}
export interface SimplePromptOptions {
  promptMessage: string;
  fallbackPromptMessage?: string;
  cancelButtonText?: string;
}
export interface SimplePromptResult {
  success: boolean;
  error?: string;
}

export interface InitiateParams {
  promptMessage: string;
  cancelButtonText?: string;
  requestFrom: string;
}

export type BiometricsEventMap = {
  initiate_device: BiometricsInitiateDevicePayload;
};
