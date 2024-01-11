import { format, parse } from "date-fns";

export function parseDate(dateString: string) {
  const parsedDate = parse(dateString, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  const formattedDate = format(parsedDate, "d MMM yyyy");
  return formattedDate;
}
