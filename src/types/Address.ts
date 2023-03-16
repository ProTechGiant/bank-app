export interface Address {
  AddressLineOne: string;
  AddressLineTwo?: string;
  District: string;
  City: string;
  PostalCode: string;
  Country: string;
}

export interface OrderCardFormValues {
  CardType: string;
  CardProductId: string;
  Pin?: string;
  AlternateAddress?: Address;
}
