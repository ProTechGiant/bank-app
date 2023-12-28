import { AddBeneficiarySelectionType, TransferType } from "@/types/InternalTransfer";

export type { AddBeneficiarySelectionType, RecipientType } from "@/types/InternalTransfer";
export interface TransferReason {
  Code: string;
  Description: string;
}

export interface PhoneNumber {
  number: string;
}
export interface ContactsResponse {
  recordID: string;
  displayName?: string;
  phoneNumbers: PhoneNumber[];
  isSelected?: boolean;
  givenName?: string;
  familyName?: string;
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
  BankLogoUrl: string;
  BeneficiaryType: string;
  isChecked?: boolean;
  beneficiaryNickname?: string;
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
  beneficiaryNickname?: string;
}

export interface EnterBeneficiaryAccountNumberFormProps {
  selectionType: AddBeneficiarySelectionType;
  onSubmit: (values: AddBeneficiary) => Promise<void>;
  testID?: string;
  showQrCodeScan: () => void;
  accountNumber: string;
}

export interface EnterBeneficiaryFormProps {
  selectionType: AddBeneficiarySelectionType;
  onSubmit: (values: AddBeneficiary) => Promise<void>;
  testID?: string;
}

export interface EnterBeneficiaryMobileFormProps {
  selectionType: AddBeneficiarySelectionType;
  onSubmit: (values: AddBeneficiary) => Promise<void>;
  onContactPress: () => void;
  onCancelContactPress: () => void;
  onBannerClosePress: () => void;
  isPermissionDenied?: boolean;
  testID?: string;
  contact?: Contact;
}

export interface Contact {
  name: string;
  phoneNumber: string;
}
export interface AddBeneficiaryFormForwardRef {
  reset: () => void;
  setSelectionValue?: (selectionValue: string) => void;
}

export interface InternalTransfer {
  Reason: string;
  data: {
    InternalTransferAmount: string;
    InternalTransferAmountCurrency: string;
    DebtorAccountCustomerAccountId: string;
    CreditorAccountCustomerAccountId: string;
    RemittanceInformation: string;
    BeneficiaryId?: string;
    TransferPurpose: string;
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
  BeneficiaryId?: string;
}

export enum TransferTypeCode {
  InternalTransferCroatia = "100",
  LocalTransferIPS = "110",
  LocalTransferSarie = "120",
  InternalTransferAlrajhi = "130",
}

export enum TransfersType {
  INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
  CROATIA_TO_ARB_TRANSFER = "CROATIA_TO_ARB_TRANSFER",
  IPS_TRANSFER = "IPS_SARIE_TRANSFER",
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
  BeneficiaryId?: string;
  AdhocBeneficiaryId?: string;
}

export interface Transaction {
  AccountId: string;
  TransactionId: string;
  CreditDebitIndicator: string;
  Status: string;
  BookingDateTime: number[];
  Amount: {
    Amount: string;
    Currency: string;
  };
  beneficiaryName: string;
  AccountNumberMasked: string;
}

export type AddBeneficiaryErrorStrings =
  | "ibanForm.ibanNotRecognisedModal"
  | "ibanForm.ibanInUseModal"
  | "accountNumberForm.accountNumberInUseModal"
  | "accountNumberForm.accountNumberNotRecognisedModal"
  | "nationalIdForm.nationalIdNotRecognisedModal"
  | "mobileNumberForm.mobileNotRecognisedModal"
  | "mobileNumberForm.mobileInUseModal";
