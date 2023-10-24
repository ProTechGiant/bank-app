import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { I18nManager } from "react-native";

export function formatChartDate(timestamp: string) {
  const dateObject = new Date(parseInt(timestamp));
  const formattedDate = format(dateObject, "MMM yyyy", { locale: I18nManager.isRTL ? arLocale : undefined });
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

export function calculateExpectedReturnForYears(investmentAmount: number, performance: number, years: number) {
  const totalAmount = investmentAmount * Math.pow(1 + performance, years);
  const expectedReturn = totalAmount - investmentAmount;
  const result = expectedReturn + investmentAmount;
  return result.toLocaleString("en-US");
}
