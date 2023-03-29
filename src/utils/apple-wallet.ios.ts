import MeaPushProvisioning, {
  MppCardDataParameters,
  MppInitializeOemTokenizationResponseData,
} from "@meawallet/react-native-mpp";

import api from "@/api";
import { info, warn } from "@/logger";
import version from "@/version";

import { generateRandomId } from "./index";

export async function initializeAppleWalletAsync() {
  MeaPushProvisioning.ApplePay.setDebugLoggingEnabled(version.buildType === "dev" || version.buildType === "eit");

  MeaPushProvisioning.initialize()
    .then(() => info("mpp-wallet", "Initialized MPP sdk"))
    .catch(error => warn("mpp-wallet", "Could not intialize MPP sdk: ", JSON.stringify(error)));
}

let isAppleWalletAvailableCached: boolean | undefined;
export async function isAppleWalletAvailableAsync() {
  if (isAppleWalletAvailableCached === undefined) {
    const [isPassLibraryAvailable, canAddPaymentPass] = await Promise.all([
      MeaPushProvisioning.ApplePay.isPassLibraryAvailable(),
      MeaPushProvisioning.ApplePay.canAddPaymentPass(),
    ]);

    isAppleWalletAvailableCached = isPassLibraryAvailable && canAddPaymentPass;
  }

  return isAppleWalletAvailableCached;
}

interface TokenizationResponse {
  TimeStamp: string;
  CardId: string;
  SecretKey: string;
}

export async function tokenizeCardForAppleWalletAsync(cardId: string) {
  const tokenizationInput = await api<TokenizationResponse>(
    "v1",
    `cards/tokenized/${cardId}`,
    "GET",
    undefined,
    undefined,
    {
      ["X-Correlation-Id"]: generateRandomId(),
    }
  );

  const { CardId, SecretKey } = tokenizationInput;
  const cardDataParams = MppCardDataParameters.withCardSecret(CardId, SecretKey);

  return MeaPushProvisioning.ApplePay.initializeOemTokenization(cardDataParams);
}

export async function canAddCardToAppleWalletAsync(params: MppInitializeOemTokenizationResponseData) {
  const identifier = params.primaryAccountIdentifier;
  if (identifier === "") return true;

  return MeaPushProvisioning.ApplePay.canAddSecureElementPassWithPrimaryAccountIdentifier(identifier);
}

export function addCardToAppleWalletAsync(params: MppInitializeOemTokenizationResponseData) {
  return MeaPushProvisioning.ApplePay.showAddPaymentPassView(params);
}
