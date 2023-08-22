import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { TimeFrameInterface } from "../types";

export default function formatTimeRange(timeFrame: TimeFrameInterface): string {
  let numMonths;
  switch (timeFrame.value) {
    case "THREE_MONTHS":
      numMonths = 3;
      break;
    case "SIX_MONTHS":
      numMonths = 6;
      break;
    default:
      numMonths = 12;
  }

  const currentDate = new Date();
  const endDate = subMonths(currentDate, 1);
  const startDate = subMonths(endDate, numMonths - 1);

  const startFormatted = format(startOfMonth(startDate), "dd MMMM yyyy");
  const endFormatted = format(endOfMonth(endDate), "dd MMMM yyyy");
  return `${startFormatted} - ${endFormatted}`;
}
