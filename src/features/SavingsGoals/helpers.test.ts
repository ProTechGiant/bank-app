import { SavingsPotDetailsResponse } from "./types";
import { calculateGoalBalanceOverThreeQuarters, isNextMonth } from "./helpers";

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
