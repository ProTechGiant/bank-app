import formatDateString from "./format-date-string";

describe("formatDateString", () => {
  it("returns the date in required format", () => {
    expect(formatDateString("8/21/23, 11:29 AM")).toBe("21 Aug 2023 ");
  });
});
