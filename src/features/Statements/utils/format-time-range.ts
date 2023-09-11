import { format, subDays, subMonths } from "date-fns";

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
  const endDate = subDays(currentDate, 1);
  const startDate = subMonths(endDate, numMonths);

  const startFormatted = format(startDate, "dd MMMM yyyy");
  const endFormatted = format(endDate, "dd MMMM yyyy");
  return `${startFormatted} - ${endFormatted}`;
}
