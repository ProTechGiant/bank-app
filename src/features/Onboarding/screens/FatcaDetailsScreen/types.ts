export interface ForeignTaxCountry {
  CountryName: string;
  TaxReferenceNumber: string;
}

export interface FatcaFormInput {
  ForeignTaxResidencyFlag: boolean | null;
  ForeignTaxCountry: Array<ForeignTaxCountry>;
}
