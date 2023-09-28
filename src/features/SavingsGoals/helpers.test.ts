import { addDays, addMonths, format } from "date-fns";

import { calculateGoalBalanceOverThreeQuarters, isNextMonth, setDateAndFormatRecurringPayment } from "./helpers";
import { SavingsPotDetailsResponse } from "./types";

describe("calculateGoalBalanceOverThreeQuarters", () => {
  it("returns overThreeQuarters true when availableSavingsPotBalance is greater than or equal to three quarters of savingsPotGoal", () => {
    const data = {
      TargetAmount: "400",
      AvailableBalanceAmount: "301",
    } as SavingsPotDetailsResponse;
    const result = calculateGoalBalanceOverThreeQuarters(data);
    expect(result.overThreeQuarters).toBe(true);
  });

  it("returns overThreeQuarters false when availableSavingsPotBalance is less than three quarters of savingsPotGoal", () => {
    const data = {
      TargetAmount: "400",
      AvailableBalanceAmount: "200",
    } as SavingsPotDetailsResponse;
    const result = calculateGoalBalanceOverThreeQuarters(data);
    expect(result.overThreeQuarters).toBe(false);
  });

  it("returns difference as a negative number when availableSavingsPotBalance is greater than savingsPotGoal", () => {
    const data = {
      TargetAmount: "400",
      AvailableBalanceAmount: "500",
    } as SavingsPotDetailsResponse;
    const result = calculateGoalBalanceOverThreeQuarters(data);
    expect(result.difference).toBeLessThan(0);
  });

  it("returns difference as 0 when availableSavingsPotBalance is equal to savingsPotGoal", () => {
    const data = {
      TargetAmount: "400",
      AvailableBalanceAmount: "400",
    } as SavingsPotDetailsResponse;
    const result = calculateGoalBalanceOverThreeQuarters(data);
    expect(result.difference).toBe(0);
  });

  it("returns difference as a positive number when availableSavingsPotBalance is less than savingsPotGoal", () => {
    const data = {
      TargetAmount: "400",
      AvailableBalanceAmount: "300",
    } as SavingsPotDetailsResponse;
    const result = calculateGoalBalanceOverThreeQuarters(data);
    expect(result.difference).toBeGreaterThan(0);
  });
});

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

describe("setDateAndFormatRecurringPayment", () => {
  test("should return the current date when inputDay is NaN", () => {
    expect(setDateAndFormatRecurringPayment(NaN)).toBe("");
  });

  test("should return the correct date when inputDay is greater than the current day", () => {
    const currentDate = new Date();
    const inputDay = addDays(currentDate, 3).getDate();

    const expectedResult = format(addDays(currentDate, 3), "yyyyMMdd");

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

  test("should return the correct date when inputDay is less than or equal to the current day and the format is yyyy-MM-dd", () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const inputDay = currentDay - 3;

    const newDate = addMonths(currentDate, 1);
    const expectedResult = format(newDate, "yyyy-MM-") + inputDay.toString().padStart(2, "0");

    expect(setDateAndFormatRecurringPayment(inputDay, "yyyy-MM-")).toBe(expectedResult);
  });
});
