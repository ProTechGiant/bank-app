export interface Balance {
  Data: {
    Balance: [
      {
        AccountId: string;
        Type: string;
        Amount: {
          Amount: string;
          Currency: string;
        };
      }
    ];
  };
  Meta: {
    TotalPages: number;
  };
}

export interface Account {
  Data: {
    Account: [
      {
        AccountId: string;
        Currency: string;
        AccountType: string;
        Description: string;
        OpeningDate: string;
        Account: [
          {
            schemeName: string;
            identification: string;
          }
        ];
        AccountCategory: string;
      }
    ];
    SupplementaryData: {
      CustomerFullName: string;
    };
  };
  Meta: {};
}
