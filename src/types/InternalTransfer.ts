export type RecipientType = "new" | "active" | "inactive" | undefined;
export type AddBeneficiarySelectionType = "mobileNo" | "accountId" | "IBAN" | "email" | "nationalId" | "beneficiaries";

export enum TransferType {
  InternalTransferAction = "INTERNAL_TRANSFER_ACTION",
  IpsTransferAction = "IPS_TRANSFER_ACTION",
  SarieTransferAction = "SARIE_TRANSFER_ACTION",
  CroatiaToArbTransferAction = "CROATIA_TO_ARB_TRANSFER_ACTION",
}

export enum TransferBeneficiaryType {
  CROATIA = "INTERNAL_TRANSFER",
  LOCAL = "IPS_SARIE_TRANSFER",
  ARB = "CROATIA_TO_ARB_TRANSFER",
  ALL = "ALL",
}
