import { Transaction } from "./types";

export const recentTransactions: Transaction[] = [
  {
    AccountId: "1212",
    TransactionId: "213232",
    CreditDebitIndicator: "debit",
    Status: "success",
    Amount: {
      Amount: "700",
      Currency: "SAR",
    },
    beneficiaryName: "Ahmed Abdul Aziz",
    BookingDateTime: [2023, 6, 12],
    AccountNumberMasked: "**** 5432",
  },
  {
    AccountId: "1214",
    TransactionId: "213234",
    CreditDebitIndicator: "credit",
    Status: "success",
    Amount: {
      Amount: "900",
      Currency: "SAR",
    },
    beneficiaryName: "Aiza Allee",
    BookingDateTime: [2023, 11, 7],
    AccountNumberMasked: "**** 5412",
  },
  {
    AccountId: "1218",
    TransactionId: "213244",
    CreditDebitIndicator: "credit",
    Status: "success",
    Amount: {
      Amount: "200",
      Currency: "SAR",
    },
    beneficiaryName: "Muhannad Baksh",
    BookingDateTime: [2023, 7, 20],
    AccountNumberMasked: "**** 5672",
  },
  {
    AccountId: "1221",
    TransactionId: "213344",
    CreditDebitIndicator: "credit",
    Status: "fail",
    Amount: {
      Amount: "200",
      Currency: "SAR",
    },
    beneficiaryName: "Lafiza Greiss",
    BookingDateTime: [2023, 6, 12],
    AccountNumberMasked: "**** 4572",
  },
];
