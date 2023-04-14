import { createContext, useContext, useMemo, useState } from "react";

import { AddBeneficiarySelectionType, InternalTransferEntryPoint, RecipientType } from "../types";

function noop() {
  return;
}

interface InternalTransferContextState {
  setInternalTransferEntryPoint: (value: InternalTransferEntryPoint) => void;
  internalTransferEntryPoint: InternalTransferEntryPoint | undefined;
  setAddBeneficiary: (addBeneficiary: { SelectionType: AddBeneficiarySelectionType; SelectionValue: string }) => void;
  addBeneficiary: { SelectionType: AddBeneficiarySelectionType; SelectionValue: string } | undefined;
  setTransferAmount: (value: number) => void;
  transferAmount: number | undefined;
  setReason: (value: string) => void;
  reason: string | undefined;
  setRecipient: (recipient: {
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    type: RecipientType | undefined;
  }) => void;
  recipient: {
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    type: RecipientType | undefined;
  };
}

const InternalTransferContext = createContext<InternalTransferContextState>({
  setInternalTransferEntryPoint: noop,
  internalTransferEntryPoint: undefined,
  setAddBeneficiary: noop,
  addBeneficiary: undefined,
  setTransferAmount: noop,
  transferAmount: undefined,
  setReason: noop,
  reason: undefined,
  setRecipient: noop,
  recipient: {
    accountName: undefined,
    accountNumber: undefined,
    phoneNumber: undefined,
    type: undefined,
  },
});

function InternalTransferContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<
    Pick<
      InternalTransferContextState,
      "internalTransferEntryPoint" | "addBeneficiary" | "transferAmount" | "reason" | "recipient"
    >
  >({
    internalTransferEntryPoint: undefined,
    addBeneficiary: undefined,
    transferAmount: undefined,
    reason: "",
    recipient: {
      accountName: undefined,
      accountNumber: undefined,
      phoneNumber: undefined,
      type: undefined,
    },
  });

  const setInternalTransferEntryPoint = (internalTransferEntryPoint: InternalTransferEntryPoint) => {
    setState(v => ({ ...v, internalTransferEntryPoint }));
  };

  const setAddBeneficiary = (addBeneficiary: {
    SelectionType: AddBeneficiarySelectionType;
    SelectionValue: string;
  }) => {
    setState(v => ({ ...v, addBeneficiary }));
  };

  const setTransferAmount = (transferAmount: number) => {
    setState(v => ({ ...v, transferAmount }));
  };

  const setReason = (reason: string) => {
    setState(v => ({ ...v, reason }));
  };

  const setRecipient = (recipient: {
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    type: RecipientType;
  }) => {
    setState(v => ({ ...v, recipient }));
  };

  return (
    <InternalTransferContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setInternalTransferEntryPoint,
          setAddBeneficiary,
          setTransferAmount,
          setReason,
          setRecipient,
        }),
        [state]
      )}>
      {children}
    </InternalTransferContext.Provider>
  );
}

const useInternalTransferContext = () => useContext(InternalTransferContext);

export { InternalTransferContextProvider, useInternalTransferContext };
