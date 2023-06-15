import { createContext, useContext, useMemo, useState } from "react";

import { AddBeneficiarySelectionType, InternalTransferEntryPoint, RecipientType, TransferType } from "../types";

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
    iban: string | undefined;
    type: RecipientType | undefined;
  }) => void;
  recipient: {
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    iban: string | undefined;
    type: RecipientType | undefined;
  };
  transferType: TransferType | undefined;
  setTransferType: (value: TransferType) => void;
  clearContext: () => void;
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
    iban: undefined,
    type: undefined,
  },
  transferType: undefined,
  setTransferType: noop,
  clearContext: noop,
});

function InternalTransferContextProvider({ children }: { children: React.ReactNode }) {
  const initialState = {
    internalTransferEntryPoint: undefined,
    addBeneficiary: undefined,
    transferAmount: undefined,
    reason: "",
    recipient: {
      accountName: undefined,
      accountNumber: undefined,
      phoneNumber: undefined,
      iban: undefined,
      type: undefined,
    },
    transferType: undefined,
  };
  const [state, setState] =
    useState<
      Pick<
        InternalTransferContextState,
        "internalTransferEntryPoint" | "addBeneficiary" | "transferAmount" | "reason" | "recipient" | "transferType"
      >
    >(initialState);

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
    iban: string | undefined;
    type: RecipientType;
  }) => {
    setState(v => ({ ...v, recipient }));
  };

  const setTransferType = (transferType: TransferType) => {
    setState(v => ({ ...v, transferType }));
  };

  const clearContext = () => {
    setState(initialState);
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
          setTransferType,
          clearContext,
        }),
        [state]
      )}>
      {children}
    </InternalTransferContext.Provider>
  );
}

const useInternalTransferContext = () => useContext(InternalTransferContext);

export { InternalTransferContextProvider, useInternalTransferContext };
