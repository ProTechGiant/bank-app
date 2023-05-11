import formatCurrency from "./format-currency";

describe("formatCurrency", () => {
  it("returns string with currency format", () => {
    expect(formatCurrency(123456)).toBe("123,456");
    expect(formatCurrency(123456.1)).toBe("123,456.1");
    expect(formatCurrency(123456.1, "SAR")).toBe("123,456.1 SAR");
  });
});
