import { differenceInYears, isBefore, parseISO } from "date-fns";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";

import { countryCodes } from "@/mocks/countryListDataWithCodes";

export const nationalIdRegEx = /^\b[1-2]\d{9}\b/;

export const alphaNumericSpaceRegExp = /^[a-zA-Z0-9 ]+$/;

export const alphaNumericSpaceQuoteRegExp = /^[a-zA-Z0-9" ]+$/;

export const alphaNumericRegExp = /^[a-zA-Z0-9]*$/;

export const alphaNumericSpecialCharsRegExp = /^[a-zA-Z0-9-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\ ]+$/;

export const formatIban = (input: string) => {
  const textArray = input.match(/.{1,4}/g);
  return textArray?.join(" ") || "";
};

export const ibanRegExpForARB = /^.{4}80{2}/;

export const ibanRegExp = /^[A-Za-z]{2}\d{22}$/;

export const numericRegExp = /^[0-9]+$/;

export const saudiPhoneRegExp = /^(009665|9665|\+9665|05|5)([5023649187])([0-9]{7})$/;

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const removeLeadingZeros = (input: string) => {
  return input?.replace(/^0+/, "");
};

export const getCountryName = (code: string | undefined) => {
  if (!code) return "";
  return countryCodes[parseInt(code, 10)];
};

export const removeSpaces = (input: string) => {
  return input.replace(/\s/g, "");
};

// Get the length of a typing mobile phone (remove + and country code)
export const mobilePhoneNoCountryCodeLength = (countryCode: CountryCode, input: string) => {
  return input !== undefined && input.length !== 0
    ? removeSpaces(input)?.length - getCountryCallingCode(countryCode).length - 1 ?? 0
    : 0;
};

// there were some cases where beneficiaries were created without name from the backend (may be due to testing or development) that cause it to crash.
// get first and last name of a person and return the initials
// if this function receives null, undefined or an empty string for the variable name, it will return an empty string.

export const getInitials = (name: string | undefined | null) => {
  // this is added to handle crash when name is empty, null or undefined.
  if (name === undefined || name === "" || name === null) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const isDateBeforeOnboardingDate = (onboardingDate: string, date: string) => {
  const onboarding = parseISO(onboardingDate);
  const selectedDate = parseISO(date);

  return isBefore(selectedDate, onboarding);
};

export const isDateOlderThanFiveYears = (selectedDate: string): boolean => {
  const currentDate = new Date();
  const selectedParsedDate = parseISO(selectedDate);
  const difference = differenceInYears(currentDate, selectedParsedDate);
  return difference <= 5;
};

export { default as formatCurrency } from "./format-currency";
