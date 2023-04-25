import { addMonths, format } from "date-fns";

import {
  alphaNumericRegExp,
  alphaNumericSpaceRegExp,
  alphaNumericSpecialCharsRegExp,
  formatIban,
  getInitials,
  ibanRegExp,
  nationalIdRegEx,
  numericRegExp,
  removeLeadingZeros,
  removeSpaces,
  saudiPhoneRegExp,
  setDateAndFormatRecurringPayment,
} from ".";

describe("alphaNumericSpaceRegExp", () => {
  it("String with alphabets, numbers or space", () => {
    const string = "abc 1234 xyz";
    expect(string).toMatch(alphaNumericSpaceRegExp);
  });
  it("Invalid string", () => {
    const string = "@£($)!";
    expect(string).not.toMatch(alphaNumericSpaceRegExp);
  });
});

describe("alphaNumericRegExp", () => {
  it("String with alphabets or numbers", () => {
    const string = "abc1234xyz";
    expect(string).toMatch(alphaNumericRegExp);
  });
  it("Invalid string - special characters", () => {
    const string = "@£($)!";
    expect(string).not.toMatch(alphaNumericRegExp);
  });
  it("Invalid string - space included", () => {
    const string = "abc 123";
    expect(string).not.toMatch(alphaNumericRegExp);
  });
});

describe("alphaNumericSpecialCharsRegExp", () => {
  it("String with alphabets, numbers, special characters or space", () => {
    const string = "abc 1234 xyz !-%&?";
    expect(string).toMatch(alphaNumericSpecialCharsRegExp);
  });
  it("Invalid string", () => {
    const string = "@£($)!";
    expect(string).not.toMatch(alphaNumericSpecialCharsRegExp);
  });
});

describe("formatIban", () => {
  it("add space every 4 characters", () => {
    const formattedIban = formatIban("SA1122223333444455556666");
    const expected = "SA11 2222 3333 4444 5555 6666";

    expect(formattedIban).toBe(expected);
  });
});

describe("ibanRegExp", () => {
  it("Valid - starts with two letters followed by 22 digits", () => {
    const string = "SA1234567890123456789012";
    expect(string).toMatch(ibanRegExp);
  });
  it("Invalid - starts with two letters followed by digit and letters", () => {
    const string = "SA1234567890123456789ABC";
    expect(string).not.toMatch(ibanRegExp);
  });
  it("Invalid - with 24 digits", () => {
    const string = "123456789012345678901234";
    expect(string).not.toMatch(ibanRegExp);
  });
  it("Invalid - starts with 3 letters", () => {
    const string = "SAC123456789012345678901";
    expect(string).not.toMatch(ibanRegExp);
  });
  it("Invalid - blank string", () => {
    const string = "";
    expect(string).not.toMatch(ibanRegExp);
  });
});

describe("numericRegEx", () => {
  it("Numbers only", () => {
    const string = "1234567890";
    expect(string).toMatch(numericRegExp);
  });
  it("Invalid string", () => {
    const string = "123abc";
    expect(string).not.toMatch(numericRegExp);
  });
});

describe("removeLeadingZeros", () => {
  it("String with leading zeros", () => {
    const string = "000012304500";
    expect(removeSpaces(string)).toMatch("12304500");
  });
  it("String with no leading zeros", () => {
    const string = "123456";
    expect(removeSpaces(string)).toMatch("123456");
  });
});

describe("removeSpaces", () => {
  it("String with spaces", () => {
    const string = " 123 ABC BEF ";
    expect(removeSpaces(string)).toMatch("123ABCBEF");
  });
});

describe("saudiPhoneRegExp", () => {
  it("Valid Saudi phone number", () => {
    const string = "582007210";
    expect(string).toMatch(saudiPhoneRegExp);
  });
  it("Invalid string", () => {
    const string = "1234";
    expect(string).not.toMatch(saudiPhoneRegExp);
  });
});

describe("nationalIdRegEx", () => {
  it("Numbers only", () => {
    const string = "1234567890";
    expect(string).toMatch(nationalIdRegEx);
  });
  it("Invalid characters", () => {
    const string = "123abc7890";
    expect(string).not.toMatch(nationalIdRegEx);
  });
  it("Start with 1 or 2(pass)", () => {
    const string = "1234567890";
    expect(string).toMatch(nationalIdRegEx);
  });
  it("Start with 1 or 2(pass)", () => {
    const string = "2345678901";
    expect(string).toMatch(nationalIdRegEx);
  });
  it("Must start with 1 or 2 (fail)", () => {
    const string = "356785412";
    expect(string).not.toMatch(nationalIdRegEx);
  });
  it("Must be 10 digits (fail)", () => {
    const string = "156785";
    expect(string).not.toMatch(nationalIdRegEx);
  });
  it("Must be 10 digits (pass)", () => {
    const string = "1567855456";
    expect(string).toMatch(nationalIdRegEx);
  });
});

describe("getInitials", () => {
  it("Should return first characters for first and last word", () => {
    const name = getInitials("Sian Finlay");
    const expected = "SF";

    expect(name).toBe(expected);
  });
  it("Should return uppercase", () => {
    const name = getInitials("sian finlay");
    const expected = "SF";

    expect(name).toBe(expected);
  });
  it("Should not return first characters for first and middle word", () => {
    const name = getInitials("Sian Victoria Finlay");
    const expected = "SVF";
    const expected2 = "SV";

    expect(name).not.toBe(expected);
    expect(name).not.toBe(expected2);
  });
});

describe("setDateAndFormatRecurringPayment", () => {
  test("should return the current date when inputDay is NaN", () => {
    const currentDate = new Date();
    const expectedResult = format(currentDate, "yyyyMMdd");

    expect(setDateAndFormatRecurringPayment(NaN)).toBe(expectedResult);
  });

  test("should return the correct date when inputDay is greater than the current day", () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const inputDay = currentDay + 3;

    const expectedResult = format(currentDate, "yyyyMM") + inputDay.toString().padStart(2, "0");

    expect(setDateAndFormatRecurringPayment(inputDay)).toBe(expectedResult);
  });

  test("should return the correct date when inputDay is less than or equal to the current day", () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const inputDay = currentDay - 3;

    const newDate = addMonths(currentDate, 1);
    const expectedResult = format(newDate, "yyyyMM") + inputDay.toString().padStart(2, "0");

    expect(setDateAndFormatRecurringPayment(inputDay)).toBe(expectedResult);
  });
});
