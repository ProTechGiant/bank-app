import { SavingsPotDetailsResponse } from "../../query-hooks";
import { calculateGoalBalanceOverThreeQuarters } from "./helpers";

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
