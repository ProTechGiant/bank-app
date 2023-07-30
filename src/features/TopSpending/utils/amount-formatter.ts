export const amountFormatter = (amount: number, decimalPlaces = 2, locale = "en-US"): string => {
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amount);

  return formattedAmount;
};
