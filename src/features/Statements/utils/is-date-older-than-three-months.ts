import { isBefore, subMonths } from "date-fns";

export default function isDateOlderThanThreeMonths(date: string): boolean {
  const currentDate = new Date();
  const olderDate = new Date(date);
  const threeMonthsAgo = subMonths(currentDate, 3);

  return isBefore(olderDate, threeMonthsAgo);
}
