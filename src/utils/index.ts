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

export const ibanRegExp = /^[A-Za-z]{2}\d{22}$/;

export const numericRegExp = /^[0-9]+$/;

export const saudiPhoneRegExp = /^(009665|9665|\+9665|05|5)(5|0|2|3|6|4|9|1|8|7)([0-9]{7})$/;

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

// get first and last name of a person and return the initials
export const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export { default as formatCurrency } from "./format-currency";
