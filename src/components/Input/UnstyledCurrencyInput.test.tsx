import { countDotsInString } from "./UnstyledCurrencyInput";

describe("countDotsInString", () => {
  it("Returns 0 for an empty string", () => {
    const string = "";
    expect(countDotsInString(string)).toBe(0);
  });

  it("Returns 0 if no dots", () => {
    const string = "1234567890";
    expect(countDotsInString(string)).toBe(0);
  });

  it("Returns number of dots", () => {
    const string = "123.456.7890";
    expect(countDotsInString(string)).toBe(2);
  });
});
