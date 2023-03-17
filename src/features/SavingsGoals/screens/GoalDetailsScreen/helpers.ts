import { SavingsPotDetailsResponse } from "../../query-hooks";

export const getDayFromDate = (date: string) => {
  return new Date(date).getDate();
};

export const calculateGoalBalanceOverThreeQuarters = (data: SavingsPotDetailsResponse) => {
  const savingsPotGoal = parseInt(data.TargetAmount, 10);
  const availableSavingsPotBalance = parseInt(data.AvailableBalanceAmount, 10);
  const threeQuartersOfGoal = savingsPotGoal * 0.75;
  const difference = savingsPotGoal - availableSavingsPotBalance;

  // this covers the case when the savings pots balance is higher or equal to the goal target, the user its allowed to have a bigger balance than the goal
  if (difference <= 0) {
    return {
      difference,
      overThreeQuarters: false,
    };
  }

  if (availableSavingsPotBalance >= threeQuartersOfGoal) {
    return {
      difference,
      overThreeQuarters: true,
    };
  }
  return {
    difference,
    overThreeQuarters: false,
  };
};
