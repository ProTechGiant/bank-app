import parsePhoneNumber from "libphonenumber-js";

export default function maskPhoneNumber(inputString: string, showDigits: number, isCountryCodeVisible = true) {
  const phoneNumber =
    inputString.charAt(0) === "0" ? parsePhoneNumber(inputString, DEFAULT_COUNTRY_CODE) : parsePhoneNumber(inputString);

  const formattedPhoneNumber = phoneNumber?.formatInternational() || inputString;
  const formattedPhoneNoCountryCode = formattedPhoneNumber.substring(
    formattedPhoneNumber.indexOf(" ") + 1,
    formattedPhoneNumber.length - showDigits
  );

  const countryCode = formattedPhoneNumber.substring(0, formattedPhoneNumber.indexOf(" "));
  const maskedPhoneNumber = `${formattedPhoneNoCountryCode.replace(/\d/g, "\u2022")}${inputString.slice(-showDigits)}`;

  return isCountryCodeVisible && countryCode !== "" ? `${countryCode} ${maskedPhoneNumber}` : maskedPhoneNumber;
}

const DEFAULT_COUNTRY_CODE = "SA";
