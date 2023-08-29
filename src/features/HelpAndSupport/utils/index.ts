import { format } from "date-fns";

export function formatUtcTimestampToTime(utcTimestamp: number) {
  const date = new Date(utcTimestamp);
  const formattedDate = format(date, "h:mm a");
  return formattedDate;
}
