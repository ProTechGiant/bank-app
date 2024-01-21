import { differenceInYears, isBefore, parseISO } from "date-fns";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
import DeviceInfo from "react-native-device-info";

import { countryCodes } from "@/mocks/countryListDataWithCodes";

export const nationalIdRegEx = /^[1١2٢][0-9٠-٩]{9}$/;

export const alphaNumericSpaceRegExp = /^[a-zA-Z0-9 ]+$/;

export const alphaNumericSpaceQuoteRegExp = /^[a-zA-Z0-9" ]+$/;

export const emojiSpaceAlphanumericQuoteRegExp =
  /^(?!.*[#*])[a-zA-Z0-9\p{Emoji}"'’“”‘\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\ufb50-\ufdff\ufe70-\ufeff ]*$/gu;

export const emojiRegExp =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}]/gu;

export const alphaNumericRegExp = /^[a-zA-Z0-9]*$/;

export const alphaRegExp = /^[a-zA-Z\s]*$/;

export const alphaNumericSpecialCharsRegExp = /^[a-zA-Z0-9-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\ ]+$/;

export async function getUniqueDeviceId() {
  try {
    const uniqueId = await DeviceInfo.getUniqueId();
    return uniqueId;
  } catch (error) {
    return "";
  }
}

export const formatIban = (input: string) => {
  const textArray = input?.match(/.{1,4}/g);
  return textArray?.join(" ") || "";
};

export const ibanRegExpForARB = /^.{4}80{2}/;

export const ibanRegExp = /^[A-Za-z]{2}\d{22}$/;

export const numericRegExp = /^[\d\u0660-\u0669\u06F0-\u06F9]+$/;

export const saudiPhoneRegExp = /^((00966|\+966|05)|([٠١٢٣٤٥٦٧٨٩0-9]{1,2}))(5[0-9]{8}|[٥٦٧٨٩0-9]{8})$/;

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const generateRandomId = () => {
  return generateAutomaticUUID();
};

export const generateAutomaticUUID = () => {
  const segmentLengths: number[] = [8, 4, 4, 4, 12];
  const hexChars = "0123456789abcdef";

  const randomHex = (length: number): string => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  const uuid: string = segmentLengths
    .map((length, index) => {
      if (index === 2) return "4".padEnd(length, "0");
      if (index === 3) return "a".padEnd(length, "0");
      return randomHex(length);
    })
    .join("-");

  return uuid;
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

export const makeMaskedName = (name: string): string => {
  if (!name) return "";
  let maskedName = "";
  const nameParts = name.split(" ");

  //Firstname 2, middle name 1 and last name 2 charcter visible only rest masked

  nameParts.forEach((part, index) => {
    maskedName += maskString(part, nameParts.length === 3 && index === 1 ? 1 : 2);
  });

  return maskedName;
};

function maskString(input: string, toChars: number) {
  if (typeof input !== "string" || input === undefined || input.length < toChars) {
    return "";
  }

  return (
    input.replace(
      new RegExp(`^(.{${toChars}}).*`),
      (match, thatManyChars) => thatManyChars + "*".repeat(input.length - toChars)
    ) + " "
  );
}

export const convertArabicToEnglishNumber = (str: string) => {
  const e = "٠".charCodeAt(0);
  if (str !== undefined) {
    str = str.replace(/[٠-٩]/g, function (t) {
      return (t.charCodeAt(0) - e)?.toString();
    });
  }
  return str;
};

export const getFirstName = (name: string) => {
  return name?.split(" ").at(0);
};

export { default as formatCurrency } from "./format-currency";

export const getAppVerionDetails = () => {
  const version = DeviceInfo.getVersion();
  const versionNumber = DeviceInfo.getBuildNumber();
  return `${version} (${versionNumber})`;
};
