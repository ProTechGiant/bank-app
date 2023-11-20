import { createContext, useContext, useMemo, useState } from "react";

import { AddBeneficiarySelectionType, RecipientType, TransferType } from "@/types/InternalTransfer";

function noop() {
  return;
}

interface InternalTransferContextState {
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
    bankName?: string;
    beneficiaryId?: string;
  }) => void;
  recipient: {
    bankName: string | undefined;
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    iban: string | undefined;
    type: RecipientType | undefined;
    beneficiaryId: string | undefined;
  };
  transferType: TransferType | undefined;
  setTransferType: (value: TransferType) => void;
  transferStatus: TransferStatus | undefined;
  setTransferStatus: (value: TransferStatus) => void;
  clearContext: () => void;
}

const InternalTransferContext = createContext<InternalTransferContextState>({
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
    bankName: undefined,
    beneficiaryId: undefined,
  },
  transferType: undefined,
  setTransferType: noop,
  transferStatus: undefined,
  setTransferStatus: noop,
  clearContext: noop,
});

const INITIAL_STATE = {
  addBeneficiary: undefined,
  transferAmount: undefined,
  reason: "",
  recipient: {
    accountName: undefined,
    accountNumber: undefined,
    phoneNumber: undefined,
    iban: undefined,
    type: undefined,
    bankName: undefined,
    beneficiaryId: undefined,
  },
  transferType: undefined,
  transferStatus: undefined,
};

function InternalTransferContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] =
    useState<
      Pick<
        InternalTransferContextState,
        "addBeneficiary" | "transferAmount" | "reason" | "recipient" | "transferType" | "transferStatus"
      >
    >(INITIAL_STATE);

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

  const setTransferStatus = (transferStatus: TransferStatus) => {
    setState(v => ({ ...v, transferStatus }));
  };
  const clearContext = () => {
    setState(INITIAL_STATE);
  };

  return (
    <InternalTransferContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setAddBeneficiary,
          setTransferAmount,
          setReason,
          setRecipient,
          setTransferType,
          setTransferStatus,
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
