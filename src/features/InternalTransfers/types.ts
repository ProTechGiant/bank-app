import { AddBeneficiarySelectionType, TransferType } from "@/types/InternalTransfer";

export type { AddBeneficiarySelectionType, InternalTransferEntryPoint, RecipientType } from "@/types/InternalTransfer";
export { TransferType } from "@/types/InternalTransfer";

export interface TransferReason {
  Code: string;
  Description: string;
}

export interface BeneficiaryType {
  BeneficiaryId: string;
  BankName: string;
  Name: string;
  IBAN?: string;
  BankAccountNumber: string;
  PhoneNumber?: string;
  Active: boolean;
  IVRValidated: boolean;
}

export interface TransferAccount {
  accountName?: string;
  accountNumber?: string;
}

export interface Note {
  content: string;
  attachment: string;
}

export interface AddNoteParams {
  updateNote: (note: Note) => void;
  note: Note;
}
export interface AddBeneficiary {
  SelectionType: AddBeneficiarySelectionType;
  SelectionValue: string;
}

export interface EnterBeneficiaryFormProps {
  selectionType: AddBeneficiarySelectionType;
  onSubmit: (values: AddBeneficiary) => Promise<void>;
}

export interface AddBeneficiaryFormForwardRef {
  reset: () => void;
}

export interface InternalTransfer {
  Reason: string;
  data: {
    InternalTransferAmount: string;
    InternalTransferAmountCurrency: string;
    DebtorAccountCustomerAccountId: string;
    CreditorAccountCustomerAccountId: string;
    RemittanceInformation: string;
  };
}

export interface InternalTransferToARBRequest {
  transferAmount: string;
  transferAmountCurrency: string;
  remitterIBAN?: string;
  remitterName?: string;
  beneficiaryIBAN?: string;
  beneficiaryName?: string;
  clientTimestamp: string;
  transferPurpose: string;
  transferType: string;
  expressTransferFlag: string;
  customerRemarks: string;
}

export enum TransferTypeCode {
  InternalTransferCroatia = "100",
  LocalTransferIPS = "110",
  LocalTransferSarie = "120",
  InternalTransferAlrajhi = "130",
}

export type TransferBeneficiaryType = "INTERNAL_TRANSFER" | "IPS_SARIE_TRANSFER" | "CROATIA_TO_ARB_TRANSFER";

export const TRANSFER_BENEFICIARY_MAP: Record<TransferType, TransferBeneficiaryType> = {
  INTERNAL_TRANSFER_ACTION: "INTERNAL_TRANSFER",
  CROATIA_TO_ARB_TRANSFER_ACTION: "CROATIA_TO_ARB_TRANSFER",
  IPS_TRANSFER_ACTION: "IPS_SARIE_TRANSFER",
  SARIE_TRANSFER_ACTION: "IPS_SARIE_TRANSFER",
};

export interface AddQuickTransferBeneficiary {
  SelectionType: AddBeneficiarySelectionType;
  SelectionValue: string;
  Bank: {
    BankCode: string;
  };
}

export interface Bank {
  EnglishName: string;
  ArabicName: string;
  BankId: string;
  BankCode: string;
  BankShortName: string;
  Active: boolean;
}

export interface LocalTransfer {
  transferAmount: number;
  transferAmountCurrency: string;
  remitterIBAN: string;
  remitterName: string;
  beneficiaryIBAN: string;
  beneficiaryName: string;
  clientTimestamp: string;
  expressTransferFlag: string; // Required if TransferType = 04, Else it should not be submitted. Express Transfer Flag (Y: Yes N: No)
  transferPurpose: string;
  transferType: string; // "01" – Own Account Transfer / "02" – Al Rajhi Transfer/ "04" – Local Transfer
  customerRemarks: string;
}
