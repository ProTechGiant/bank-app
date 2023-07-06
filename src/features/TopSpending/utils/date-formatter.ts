import { endOfMonth, format, startOfMonth } from "date-fns";

import { CompareDurationTypes } from "../enum";

export default function dateFormatter(
  type: CompareDurationTypes,
  dates: any
): { startDate: string; endDate: string }[] {
  let convertedDates: { startDate: string; endDate: string }[] = [];
  if (type === CompareDurationTypes.MONTH) {
    for (const date of dates) {
      const month = date.month;
      const year = date.year;
      const firstDate = startOfMonth(new Date(year, month - 1));
      const lastDate = endOfMonth(new Date(year, month - 1));
      const formattedDate = {
        startDate: format(firstDate, "yyyy-MM-dd"),
        endDate: format(lastDate, "yyyy-MM-dd"),
      };
      convertedDates.push(formattedDate);
    }
  } else if (type === CompareDurationTypes.DAY) {
    for (const date of dates) {
      const formattedDate = {
        startDate: Object.keys(date)[0],
        endDate: Object.keys(date)[0],
      };
      convertedDates.push(formattedDate);
    }
  } else if (type === CompareDurationTypes.WEEK) {
    for (const date of dates) {
      const formattedDate = {
        startDate: Object.keys(date)[0],
        endDate: Object.keys(date)[Object.keys(date).length - 1],
      };
      convertedDates.push(formattedDate);
    }
  } else if (type === CompareDurationTypes.YEAR) {
    const fStartDate = dates[0] + "-01-01";
    const fEndDate = dates[0] + "-12-31";
    const sStartDate = dates[1] + "-01-01";
    const sEndDate = dates[1] + "-12-31";
    convertedDates = [
      { startDate: fStartDate, endDate: fEndDate },
      { startDate: sStartDate, endDate: sEndDate },
    ];
  }
  return convertedDates;
}
