import { isBefore, subMonths } from "date-fns";

export default function checkDateOlderThan3Months(date: string): boolean {
  const currentDate = new Date();
  const olderDate = new Date(date);
  const threeMonthsAgo = subMonths(currentDate, 3);

  return isBefore(olderDate, threeMonthsAgo);
}
