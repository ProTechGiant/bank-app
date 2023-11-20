import { TransactionItem } from "../types";

export const getRecentTransactions = (transactions: TransactionItem[]): TransactionItem[] => {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.TransactionDate).getTime() - new Date(a.TransactionDate).getTime())
    .slice(0, 5);
  return recentTransactions;
};
