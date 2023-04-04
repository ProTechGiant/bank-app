import { CountryCode, getCountryCallingCode } from "libphonenumber-js";

export const nationalIdRegEx = /^\b[1-2]\d{9}\b/;

export const alphaNumericSpaceRegExp = /^[a-zA-Z0-9 ]+$/;

export const alphaNumericRegExp = /^[a-zA-Z0-9]*$/;

export const alphaNumericSpecialCharsRegExp = /^[a-zA-Z0-9-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\ ]+$/;

export const ibanRegExp = /^[A-Za-z]{2}\d+$/;

export const numericRegExp = /^[0-9]+$/;

export const saudiPhoneRegExp = /^(009665|9665|\+9665|05|5)(5|0|2|3|6|4|9|1|8|7)([0-9]{7})$/;

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get the length of a typing mobile phone (remove + and country code)
export const mobilePhoneNoCountryCodeLength = (countryCode: CountryCode, input: string) => {
  return input !== undefined && input.length !== 0
    ? input.replace(/\s/g, "")?.length - getCountryCallingCode(countryCode).length - 1 ?? 0
    : 0;
};
