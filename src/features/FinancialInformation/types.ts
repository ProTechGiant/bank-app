export interface ListItemType {
  label: string;
  value: string;
  isSelected: boolean;
}
export interface FinancialDetails {
  OccupationCode?: string;
  AccountPurpose: string;
  SourceOfIncome: string;
  MonthlyLimit: string;
}

export interface EditFinancialInformationScreenProps {
  onBackPress: () => void;
}
