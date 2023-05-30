export const savingsMocksData = {
  data: {
    GroupedTransactions: [
      {
        Key: "BookingDateTime",
        Value: "2023-05-07",
        Transactions: [
          {
            AccountId: "123456789",
            TransactionId: "6",
            StatementReference: "One-off payment",
            CreditDebitIndicator: "Credit",
            Status: "Booked ",
            CardType: "1",
            BookingDateTime: [2023, 5, 7, 2, 31, 32, 202971000],
            ValueDateTime: [2023, 4, 11, 2, 31, 31, 202971000],
            TransactionInformation: "Outcoming Payment",
            Amount: {
              Amount: "500.0",
              Currency: "SAR",
            },
          },
        ],
      },
      {
        Key: "BookingDateTime",
        Value: "2023-04-07",
        Transactions: [
          {
            AccountId: "123456789",
            TransactionId: "13",
            StatementReference: "Regular payment",
            CreditDebitIndicator: "Credit",
            Status: "Booked ",
            CardType: "1",
            BookingDateTime: [2023, 5, 7, 2, 31, 41, 202971000],
            ValueDateTime: [2023, 4, 10, 2, 31, 31, 202971000],
            TransactionInformation: "Incoming Payment",
            Amount: {
              Amount: "6000.0",
              Currency: "SAR",
            },
          },
          {
            AccountId: "123456789",
            TransactionId: "1",
            StatementReference: "Round-up",
            CreditDebitIndicator: "Credit",
            Category: "Travel",
            Status: "Booked ",
            CardType: "1",
            BookingDateTime: [2023, 4, 7, 2, 31, 37, 202971000],
            ValueDateTime: [2023, 4, 7, 2, 31, 31, 202971000],
            TransactionInformation: "Online Transaction",
            Amount: {
              Amount: "5.0",
              Currency: "SAR",
            },
          },
          {
            AccountId: "123456789",
            TransactionId: "2",
            StatementReference: "Withdrawal",
            CreditDebitIndicator: "Debit",
            Status: "Booked ",
            CardType: "1",
            BookingDateTime: [2023, 4, 7, 2, 31, 37, 202971000],
            ValueDateTime: [2023, 4, 7, 2, 31, 31, 202971000],
            TransactionInformation: "Online Transaction",
            Amount: {
              Amount: "350.0",
              Currency: "SAR",
            },
          },
        ],
      },
    ],
  },
};
