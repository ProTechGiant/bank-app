import { format, parseISO } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { I18nManager } from "react-native";

import { MINIMUM_TARGET_DURATION } from "../constants";

export const numericValue = (goal: string) => {
  return goal.replace(/[^0-9.]/g, "");
};

/**
 * Returns a date roughly one month from the current date, adjusted by an hour earlier.
 * This adjustment helps in scenarios where strict validation might flag exactly one month as invalid.
 *
 * @returns {Date} - The adjusted Date object for one month ahead.
 */

export function getMinimumValidDate(): Date {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + MINIMUM_TARGET_DURATION);
  oneMonthFromNow.setHours(oneMonthFromNow.getHours() - 1);
  return oneMonthFromNow;
}

export const getDateOfRecurringDay = (recurringDay: string) => {
  const recurringDayNumber = parseInt(recurringDay, 10);

  const currentDate = new Date();

  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  if (currentDate.getDate() >= recurringDayNumber) {
    if (currentMonth === 11) {
      currentYear++;
      currentMonth = 0;
    } else {
      currentMonth++;
    }
    currentDate.setFullYear(currentYear);
    currentDate.setMonth(currentMonth);
  }
  currentDate.setDate(recurringDayNumber);

  const currentMonthName = I18nManager.isRTL
    ? format(currentDate, "MMMM", { locale: arLocale })
    : format(currentDate, "MMMM");
  const formattedDate = `${recurringDayNumber} ${currentMonthName} ${currentDate.getFullYear()}`;

  return formattedDate;
};

export function formatAmount(amount: number, needDecimal = true) {
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (needDecimal) {
    return formattedAmount;
  } else {
    const [wholePart] = formattedAmount.split(".");
    return wholePart;
  }
}

export function formatGoalEndDate(timestamp: string) {
  const dateObject = parseISO(timestamp);
  const formattedDate = format(dateObject, "d MMM yyyy", { locale: I18nManager.isRTL ? arLocale : undefined });
  return formattedDate;
}

export function calculateExpectedReturn(InvestmentAmount: number, Performance: number, years: number) {
  const monthlyReturns = [];
  const currentDate = new Date();

  for (let i = 1; i <= years * 12; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() + i);

    const timestamp = date.getTime();
    const totalAmount = InvestmentAmount * Math.pow(1 + Performance, i / 12);
    const expectedReturn = totalAmount - InvestmentAmount;
    monthlyReturns.push({ x: timestamp, y: Math.round(expectedReturn + InvestmentAmount) });
  }

  return monthlyReturns;
}

export function formatChartDate(timestamp: string) {
  const dateObject = new Date(parseInt(timestamp));
  const formattedDate = format(dateObject, "MMM yyyy", { locale: I18nManager.isRTL ? arLocale : undefined });
  return formattedDate;
}
