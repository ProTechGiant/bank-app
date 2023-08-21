import { differenceInYears, parseISO } from "date-fns";

import { maxStatementOlderPeriod } from "../constants";

export default function isDateOlderThanFiveYears(selectedDate: string): boolean {
  const currentDate = new Date();
  const selectedParsedDate = parseISO(selectedDate);
  const difference = differenceInYears(currentDate, selectedParsedDate);
  return difference <= maxStatementOlderPeriod;
}
