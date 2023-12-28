import ReactNativeBiometrics from "react-native-biometrics";

import { warn } from "@/logger";

import {
  BiometricKeysExistResult,
  CreateKeysResult,
  CreateSignatureOptions,
  CreateSignatureResult,
  DeleteKeysResult,
  InitiateParams,
  IsSensorAvailableResult,
  SimplePromptOptions,
  SimplePromptResult,
} from "./biometrics.types";

const createSignatureErrors = {
  duplicatePrompt: "Duplicate prompt",
  userCancellation: "User cancellation",
};

const Biometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

class BiometricsService {
  private sensorResult?: IsSensorAvailableResult;
  private isPromptOngoing = false;

  async isSensorAvailable(): Promise<IsSensorAvailableResult> {
    if (this.sensorResult) {
      return this.sensorResult;
    }
    const res = await Biometrics.isSensorAvailable();
    return res as IsSensorAvailableResult;
  }

  async createKeys(): Promise<CreateKeysResult> {
    return Biometrics.createKeys();
  }

  async biometricKeysExist(): Promise<BiometricKeysExistResult> {
    return Biometrics.biometricKeysExist();
  }

  async deleteKeys(): Promise<DeleteKeysResult> {
    return Biometrics.deleteKeys();
  }

  async createSignature(options: CreateSignatureOptions): Promise<CreateSignatureResult> {
    if (this.isPromptOngoing) {
      this.isPromptOngoing = false;
      return { error: createSignatureErrors.duplicatePrompt, success: false };
    }
    this.isPromptOngoing = true;
    const result = await Biometrics.createSignature(options);

    /* User will not be able to call createSignature within 1 second */
    setTimeout(() => {
      this.isPromptOngoing = false;
    }, 1000);

    return result;
  }

  async simplePrompt(options: SimplePromptOptions): Promise<SimplePromptResult> {
    return Biometrics.simplePrompt(options);
  }

  async checkBiometricSupport(
    setIsBiometricSupported: (isSupported: boolean) => void,
    setAvailableBiometricType?: (biometricType: string) => void,
    setError?: (error: string) => void
  ): Promise<void> {
    try {
      const { available, biometryType, error } = await this.isSensorAvailable();
      if (error) {
        setError?.(error);
      } else {
        setIsBiometricSupported(available);
        setAvailableBiometricType?.(biometryType || "");
        warn("biometrics", `${available} ${biometryType}`);
      }
    } catch (error) {
      warn("biometrics", `biometrics failed ${error}`);
    }
  }

  async initiate({ promptMessage, cancelButtonText, requestFrom }: InitiateParams): Promise<string | undefined> {
    try {
      await this.createKeys();
    } catch (error) {
      throw new Error(error ? JSON.stringify(error) : "Try again please");
    }

    try {
      const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
      const payload = epochTimeSeconds + "some message";
      const { success, error } = await this.createSignature({
        promptMessage: promptMessage,
        cancelButtonText: cancelButtonText,
        payload: payload,
        requestFrom,
      });

      if (!success) {
        return error;
      }
    } catch (error: any) {
      return error;
    }
  }
}

const biometricsService = new BiometricsService();
export default biometricsService;
