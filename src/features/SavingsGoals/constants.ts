import { SavingGoalTransactionsApiParams } from "./types";

export const PAYMENT_FREQUENCY = "e0Y e1M e0W e0D";

export const PAGE_SIZE = 10;
export const PAGE_OFFSET = 0;
export const DEFAULT_TRANSACTION_STATUS = "COMPLETED";
export const DEFAULT_SORT_DIRECTION = "DESC";
export const DEFAULT_SORT_BY = "bookingDateTime";
export const GROUP_BY = "Transactions";

export const filterObject: { [key: string]: string } = {
  Withdrawal: "01",
  "Regular Payment": "02",
  "Round-up": "03",
  "One-off Payment": "04",
};

export const defaultTransactionApiParams: SavingGoalTransactionsApiParams = {
  PageSize: PAGE_SIZE,
  PageNumber: PAGE_OFFSET,
  sortDirection: DEFAULT_SORT_DIRECTION,
  GroupBy: GROUP_BY,
  sortBy: DEFAULT_SORT_BY,
  Status: DEFAULT_TRANSACTION_STATUS,
};
