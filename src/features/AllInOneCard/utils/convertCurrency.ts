//TODO : replace later when I API get ready
import { CurrencyConversion } from "../mocks";

export function convertCurrency(amount: number, sourceCurrency: string, destinationCurrency: string) {
  const foreignCurrency = destinationCurrency.toLocaleLowerCase() !== "sar" ? destinationCurrency : sourceCurrency;

  const conversionRate = CurrencyConversion[foreignCurrency];
  const splitParts = conversionRate.split(" ");
  return destinationCurrency.toLocaleLowerCase() === "sar"
    ? amount / Number(splitParts[3])
    : amount * Number(splitParts[3]);
}
