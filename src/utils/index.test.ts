import {
  alphaNumericSpaceRegExp,
  alphaNumericSpecialCharsRegExp,
  nationalIdRegEx,
  numericRegExp,
  saudiPhoneRegExp,
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
