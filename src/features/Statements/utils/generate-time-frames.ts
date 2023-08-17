import { differenceInMonths, parseISO } from "date-fns";
import { TFunction } from "i18next";

import { TimeFrameInterface } from "../types";

export default function generateTimeFrames(onboardingDateString: string, t: TFunction): Array<TimeFrameInterface> {
  const currentDate = new Date();
  const onboardingDate = parseISO(onboardingDateString);
  const monthsDiff = differenceInMonths(currentDate, onboardingDate);

  const dateRanges: Array<TimeFrameInterface> = [];

  if (monthsDiff >= 3) {
    dateRanges.push({ label: t("Statements.RequestStatementScreen.DateRanges.last3Months"), value: "last3Month" });
  }
  if (monthsDiff >= 6) {
    dateRanges.push({ label: t("Statements.RequestStatementScreen.DateRanges.last6Months"), value: "last6Month" });
  }
  if (monthsDiff >= 12) {
    dateRanges.push({ label: t("Statements.RequestStatementScreen.DateRanges.last12Months"), value: "last12Month" });
  }

  return dateRanges;
}
