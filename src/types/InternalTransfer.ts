export type RecipientType = "new" | "active" | "inactive" | undefined;
export type AddBeneficiarySelectionType = "mobileNo" | "accountId" | "IBAN" | "email" | "nationalId";

export enum TransferType {
  InternalTransferAction = "INTERNAL_TRANSFER_ACTION",
  IpsTransferAction = "IPS_TRANSFER_ACTION",
  SarieTransferAction = "SARIE_TRANSFER_ACTION",
  CroatiaToArbTransferAction = "CROATIA_TO_ARB_TRANSFER_ACTION",
}
