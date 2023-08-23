import { isBefore, parseISO } from "date-fns";

export default function isDateBeforeOnboardingDate(onboardingDate: string, date: string) {
  const onboarding = parseISO(onboardingDate);
  const selectedDate = parseISO(date);

  return isBefore(selectedDate, onboarding);
}
