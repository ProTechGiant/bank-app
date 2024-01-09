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
  setSignInTime: (value: string) => void;
  signInTime: string | undefined;
  isReadOnly: boolean | undefined;
  setIsReadOnly: (value: boolean) => void;
  setRecipient: (recipient: {
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    iban: string | undefined;
    type: RecipientType | undefined;
    bankName?: string;
    beneficiaryId?: string;
    adhocBeneficiaryId?: string | undefined;
  }) => void;
  recipient: {
    bankName: string | undefined;
    accountName: string | undefined;
    accountNumber: string | undefined;
    phoneNumber: string | undefined;
    iban: string | undefined;
    type: RecipientType | undefined;
    beneficiaryId: string;
    adhocBeneficiaryId: string | undefined;
  };
  transferType: TransferType | undefined;
  setTransferType: (value: TransferType) => void;
  transferStatus: TransferStatus | undefined;
  setTransferStatus: (value: TransferStatus) => void;
  clearContext: () => void;
  beneficiary: {
    BankName: string | undefined;
    FullName: string | undefined;
    IBAN: string | undefined;
    active: boolean | undefined;
    beneficiaryId: string | undefined;
    nickname: string | undefined;
    type: string | undefined;
    BeneficiaryType: string | undefined;
    BankAccountNumber: string | undefined;
    BankArabicName: string | undefined;
  };
  setBeneficiary: (beneficiary: {
    BankName: string;
    BankArabicName: string;
    FullName: string;
    IBAN: string;
    active: boolean;
    beneficiaryId: string;
    nickname: string;
    type: string;
    BeneficiaryType: string;
    BankAccountNumber: string;
  }) => void;
}

const InternalTransferContext = createContext<InternalTransferContextState>({
  setAddBeneficiary: noop,
  addBeneficiary: undefined,
  setTransferAmount: noop,
  transferAmount: undefined,
  setReason: noop,
  reason: undefined,
  setSignInTime: noop,
  signInTime: undefined,
  isReadOnly: undefined,
  setIsReadOnly: noop,
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
  beneficiary: {
    BankName: undefined,
    FullName: undefined,
    IBAN: undefined,
    active: undefined,
    beneficiaryId: undefined,
    nickname: undefined,
    type: undefined,
    BeneficiaryType: undefined,
    BankAccountNumber: undefined,
  },
  setBeneficiary: noop,
});

const INITIAL_STATE = {
  addBeneficiary: undefined,
  transferAmount: undefined,
  reason: "",
  signInTime: "",
  isReadOnly: false,
  recipient: {
    accountName: undefined,
    accountNumber: undefined,
    phoneNumber: undefined,
    iban: undefined,
    type: undefined,
    bankName: undefined,
    beneficiaryId: undefined,
  },
  beneficiary: {
    BankName: undefined,
    FullName: undefined,
    IBAN: undefined,
    active: undefined,
    beneficiaryId: undefined,
    nickname: undefined,
    type: undefined,
    BeneficiaryType: undefined,
    BankAccountNumber: undefined,
  },
  transferType: undefined,
  transferStatus: undefined,
};

function InternalTransferContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] =
    useState<
      Pick<
        InternalTransferContextState,
        "addBeneficiary" | "transferAmount" | "reason" | "recipient" | "transferType" | "transferStatus" | "signInTime"
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

  const setSignInTime = (signInTime: string) => {
    setState(v => ({ ...v, signInTime }));
  };

  const setIsReadOnly = (isReadOnly: boolean) => {
    setState(v => ({ ...v, isReadOnly }));
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

  const setBeneficiary = (beneficiary: {
    BankName: string | undefined;
    FullName: string | undefined;
    IBAN: string | undefined;
    active: boolean | undefined;
    beneficiaryId: string | undefined;
    nickname: string | undefined;
    type: string | undefined;
  }) => {
    setState(v => ({ ...v, beneficiary }));
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
          setIsReadOnly,
          setSignInTime,
          setRecipient,
          setBeneficiary,
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
