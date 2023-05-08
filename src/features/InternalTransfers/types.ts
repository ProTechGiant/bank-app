export interface TransferReason {
  Code: string;
  Description: string;
}

export interface BeneficiaryType {
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

export type InternalTransferEntryPoint = "homepage" | "payment-hub";

export type RecipientType = "new" | "active" | "inactive" | undefined;

export interface AddNoteParams {
  updateNote: (note: Note) => void;
  note: Note;
}

export type AddBeneficiarySelectionType = "mobileNo" | "accountId" | "IBAN";

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
  InternalTransferAmount: string;
  InternalTransferAmountCurrency: string;
  DebtorAccountCustomerAccountId: string;
  CreditorAccountCustomerAccountId: string;
  RemittanceInformation: string;
}

// Transfer Types: QuickOrStandardType: 110 | SAIREType: 120;
export type TransferType = "110" | "120";
