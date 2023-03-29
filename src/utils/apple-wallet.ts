import { MppInitializeOemTokenizationResponseData, MppPassActivationState } from "@meawallet/react-native-mpp";

export async function initializeAppleWalletAsync() {
  // ..
}

export async function isAppleWalletAvailableAsync() {
  return false;
}

export async function tokenizeCardForAppleWalletAsync(
  _cardId: string
): Promise<MppInitializeOemTokenizationResponseData> {
  throw new Error("Apple Wallet not supported on non-iOS platforms");
}

export async function canAddCardToAppleWalletAsync(
  _params: MppInitializeOemTokenizationResponseData
): Promise<boolean> {
  throw new Error("Apple Wallet not supported on non-iOS platforms");
}

export function addCardToAppleWalletAsync(
  _params: MppInitializeOemTokenizationResponseData
): Promise<MppPassActivationState> {
  throw new Error("Apple Wallet not supported on non-iOS platforms");
}
