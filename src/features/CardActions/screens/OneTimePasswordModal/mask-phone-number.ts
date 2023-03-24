import parsePhoneNumber from "libphonenumber-js";

export default function maskPhoneNumber(inputString: string) {
  const phoneNumber = parsePhoneNumber(inputString);
  const formattedPhoneNumber = phoneNumber?.formatInternational() || inputString;

  const formattedPhoneNoCountryCode = formattedPhoneNumber.substring(
    formattedPhoneNumber.indexOf(" ") + 1,
    formattedPhoneNumber.length - 2
  );

  return formattedPhoneNoCountryCode.replace(/\d/g, "\u2022");
}
