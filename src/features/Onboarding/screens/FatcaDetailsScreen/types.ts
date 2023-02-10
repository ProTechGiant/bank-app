export interface ForeignTaxCountry {
  countryName: string;
  taxReferenceNumber: string;
}

export interface FatcaFormInput {
  foreignTaxResidencyFlag: boolean | null;
  foreignTaxCountry: Array<ForeignTaxCountry>;
}
