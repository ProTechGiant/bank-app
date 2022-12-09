export const mockAccounts = [
  {
    Data: {
      Account: [
        {
          AccountId: "16516",
          Currency: "SAR",
          AccountType: "CURRENT",
          Description: "Current Account",
          OpeningDate: "2022-03-16T00:00:00",
          Account: [
            {
              schemeName: "IBAN.NUMBER",
              identification: "SA66DEMO6016130",
            },
            {
              schemeName: "SWIFT.CODE",
              identification: "DEMOPX",
            },
            {
              schemeName: "CIF",
              identification: "100367",
            },
          ],
          AccountCategory: "1001",
        },
      ],
      SupplementaryData: {
        CustomerFullName: "J Johnson Shihab2",
      },
    },
    Meta: {},
  },
];

export const mockAccountBalances = [
  {
    Data: {
      Balance: [
        {
          AccountId: "16516",
          Type: "INTERIM_AVAILABLE",
          Amount: {
            Amount: "3438433.00",
            Currency: "SAR",
          },
        },
        {
          AccountId: "16516",
          Type: "INTERIM_BOOKED",
          Amount: {
            Amount: "20.00",
            Currency: "SAR",
          },
        },
        {
          AccountId: "16516",
          Type: "LOCKED_AMOUNT",
          Amount: {
            Amount: "40.00",
            Currency: "SAR",
          },
        },
      ],
    },
    Meta: {
      TotalPages: 3,
    },
  },
];
