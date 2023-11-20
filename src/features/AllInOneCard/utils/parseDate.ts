import { parse } from "date-fns";
import { enUS } from "date-fns/locale";

export function parseDate(dateString: string) {
  const parsedDate = parse(dateString, "dd LLL yyyy", new Date(), { locale: enUS });
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  const date = new Date(parsedDate.getTime() + oneDayMilliseconds);
  return date;
}
