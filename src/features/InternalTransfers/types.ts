export interface BeneficiaryType {
  id: number;
  name: string;
  bank: string;
  accountNumber: string;
  isActive?: boolean;
  lastUpdated: Date;
}
