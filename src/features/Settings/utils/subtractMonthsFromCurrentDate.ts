import { format, subMonths } from "date-fns";

export type MonthsOption = "1" | "3" | "6" | "12" | "more";

export function subtractMonthsFromCurrentDate(months: MonthsOption): string[] {
  const currentDate = new Date();

  if (months === "more") {
    const oneYearAgo = subMonths(currentDate, 12);
    const formattedOneYearAgo = format(oneYearAgo, "yyyy-MM-dd");

    const fixedDate = "2000-01-01";
    return [formattedOneYearAgo, fixedDate];
  }

  const parsedMonths = parseInt(months, 10);
  const newDate = subMonths(currentDate, parsedMonths);
  const formattedDate = format(newDate, "yyyy-MM-dd");
  const formattedCurrentDateDate = format(currentDate, "yyyy-MM-dd");

  return [formattedCurrentDateDate, formattedDate];
}
