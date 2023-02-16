import isNextMonth from "./is-next-month";

describe("isNextMonth", () => {
  it("is next month if next month of current year", () => {
    const nextMonth = new Date(Date.parse("2023-11-24T00:00:00.000Z"));
    const currentMonth = new Date(Date.parse("2023-10-24T00:00:00.000Z"));

    expect(isNextMonth(nextMonth, currentMonth)).toBeTruthy();
    expect(isNextMonth(currentMonth, nextMonth)).toBeFalsy();
  });

  it("is next month if next month of next year", () => {
    const nextMonth = new Date(Date.parse("2024-01-01T00:00:00.000Z"));
    const currentMonth = new Date(Date.parse("2023-12-24T00:00:00.000Z"));

    expect(isNextMonth(nextMonth, currentMonth)).toBeTruthy();
    expect(isNextMonth(currentMonth, nextMonth)).toBeFalsy();
  });

  it("is not next month if same month", () => {
    const currentMonth = new Date(Date.parse("2023-11-24T00:00:00.000Z"));
    const alsoCurrentMonth = new Date(Date.parse("2023-11-24T00:00:00.000Z"));

    expect(isNextMonth(currentMonth, alsoCurrentMonth)).toBeFalsy();
    expect(isNextMonth(alsoCurrentMonth, currentMonth)).toBeFalsy();
  });
});
