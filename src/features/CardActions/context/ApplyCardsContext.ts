import { createContext, useContext } from "react";

import { PHYSICAL_CARD_TYPE } from "@/constants";
import { Address } from "@/types/Address";

export interface ApplyCardInput {
  CardType: string;
  CardProductId: string | undefined;
  EncryptedPincode: string | undefined;
  AlternateAddress: Address | undefined;
}

interface ApplyCardsContextValue {
  values: ApplyCardInput;
  setValue: <T extends keyof ApplyCardInput>(name: T, values: ApplyCardInput[T]) => void;
}

const ApplyCardsContext = createContext<ApplyCardsContextValue>({
  setValue: () => {
    // ..
  },
  values: {
    CardType: PHYSICAL_CARD_TYPE,
    CardProductId: undefined,
    EncryptedPincode: undefined,
    AlternateAddress: undefined,
  },
});

export function useApplyCardsContext() {
  return useContext(ApplyCardsContext);
}

export default ApplyCardsContext;
