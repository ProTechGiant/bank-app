import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { TimeFrameInterface } from "../types";

export default function formatTimeRange(timeFrame: TimeFrameInterface): string {
  let numMonths;
  if (timeFrame.value === "last3Month") numMonths = 3;
  else if (timeFrame.value === "last6Month") numMonths = 6;
  else numMonths = 12;

  const currentDate = new Date();
  const endDate = subMonths(currentDate, 1);
  const startDate = subMonths(endDate, numMonths - 1);

  const startFormatted = format(startOfMonth(startDate), "dd MMMM yyyy");
  const endFormatted = format(endOfMonth(endDate), "dd MMMM yyyy");
  return `${startFormatted} - ${endFormatted}`;
}
