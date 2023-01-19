import { alphaNumericSpecialCharsRegExp, numericRegExp, saudiPhoneRegExp } from ".";

describe("alphaNumericSpecialCharsRegExp", () => {
  it("string with alphabets, numbers, special characters or space", () => {
    const string = "abc 1234 xyz !-%&?";
    expect(string).toMatch(alphaNumericSpecialCharsRegExp);
  });
  it("invalid string", () => {
    const string = "@£($)!";
    expect(string).not.toMatch(alphaNumericSpecialCharsRegExp);
  });
});

describe("numericRegEx", () => {
  it("Numbers only", () => {
    const string = "1234567890";
    expect(string).toMatch(numericRegExp);
  });
  it("invalid string", () => {
    const string = "123abc";
    expect(string).not.toMatch(numericRegExp);
  });
});

describe("saudiPhoneRegExp", () => {
  it("valid Saudi phone number", () => {
    const string = "582007210";
    expect(string).toMatch(saudiPhoneRegExp);
  });
  it("invalid string", () => {
    const string = "1234";
    expect(string).not.toMatch(saudiPhoneRegExp);
  });
});
