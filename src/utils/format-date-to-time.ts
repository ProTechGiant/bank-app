import { format, parse } from "date-fns";

export default function formatDateToTime(date: string) {
  const formatDate = parse(date, "MM/d/yy, hh:mm a", new Date());
  return format(new Date(formatDate), "hh:mm a");
}
