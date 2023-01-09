import { alphaNumericSpaceRegExp, numericRegExp, saudiPhoneRegExp } from ".";

describe("alphaNumericSpaceRegEx", () => {
  it("string with alphabets, numbers or space", () => {
    const string = "abc 1234 xyz";
    expect(string).toMatch(alphaNumericSpaceRegExp);
  });
  it("invalid string", () => {
    const string = "@£($)!";
    expect(string).not.toMatch(alphaNumericSpaceRegExp);
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
