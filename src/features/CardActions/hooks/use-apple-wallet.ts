import { useEffect, useState } from "react";

import { SINGLE_USE_CARD_TYPE } from "@/constants";
import * as appleWallet from "@/utils/apple-wallet";

import { useCard, useMeawalletTokenization } from "./query-hooks";

export default function useAppleWallet(cardId: string) {
  const tokenizedInfo = useMeawalletTokenization(cardId);
  const cardInfo = useCard(cardId);

  const [isAppleWalletAvailable, setIsAppleWalletAvailable] = useState(false);
  const [cardIsNotAddedToAppleWallet, setCardIsNotAddedToAppleWallet] = useState(false);

  useEffect(() => {
    async function main() {
      const available = await appleWallet.isAppleWalletAvailableAsync();
      setIsAppleWalletAvailable(available);
    }

    main();
  }, []);

  useEffect(() => {
    async function main() {
      if (tokenizedInfo.data === undefined) return;
      const response = await appleWallet.canAddCardToAppleWalletAsync(tokenizedInfo.data);

      setCardIsNotAddedToAppleWallet(response);
    }

    main();
  }, [tokenizedInfo.data]);

  const handleOnAddToAppleWallet = () => {
    if (tokenizedInfo.data === undefined) {
      throw new Error(`Cannot add card "${cardId} to Apple Wallet since tokenization info is not available`);
    }

    return appleWallet.addCardToAppleWalletAsync(tokenizedInfo.data);
  };

  return {
    isAppleWalletAvailable,
    canAddCardToAppleWallet:
      cardIsNotAddedToAppleWallet && cardInfo.data !== undefined && cardInfo.data?.CardType !== SINGLE_USE_CARD_TYPE,
    addCardToAppleWallet: handleOnAddToAppleWallet,
  };
}
