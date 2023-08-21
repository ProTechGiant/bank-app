import { differenceInYears, isBefore, isEqual, parse } from "date-fns";

import { maxStatementLongerYearPeriod } from "../constants";

export default function isDateValid(startDateString: string | null, endDateString: string | null): boolean {
  if (!startDateString || !endDateString) return false;
  const startDate = parse(startDateString, "yyyy-MM-dd", new Date());
  const endDate = parse(endDateString, "yyyy-MM-dd", new Date());

  const yearsDifference = differenceInYears(endDate, startDate);
  return (
    (isEqual(startDate, endDate) || isBefore(startDate, endDate)) && yearsDifference < maxStatementLongerYearPeriod
  );
}
