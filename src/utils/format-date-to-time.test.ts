import formatDateToTime from "./format-date-to-time";

describe("formatDateToTime", () => {
  it("returns the time only from date and time", () => {
    expect(formatDateToTime("8/21/23, 11:29 AM")).toBe("11:29 AM");
  });
});
