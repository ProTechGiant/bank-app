export interface PushConsentBodyRequest {
  ConsentId: string;
  DecisionId: number;
  Accounts: Account[];
  Cards: Card[];
}

interface Account {
  Id: number;
}

interface Card {
  AccountNumber: string;
}
