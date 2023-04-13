export interface TransferValue {
  PaymentAmount: number;
  TransferReason: TransferReason;
}

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

export interface ReviewScreenParams {
  amount: number;
  receiver: TransferAccount;
  reason: TransferReason;
}

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
}
