import { addMonths, format } from "date-fns";

import { SavingsPotDetailsResponse } from "./types";

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

// left >= right
export const isNextMonth = (date: Date, reference: Date = new Date()) => {
  return (
    (date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth() + 1) || // next month in current year
    (date.getFullYear() === reference.getFullYear() + 1 && date.getMonth() === 0 && reference.getMonth() === 11) // first month of next year
  );
};

export const setDateAndFormatRecurringPayment = (inputDay: number) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  let newDate;
  let returnedDate;

  if (Number.isNaN(inputDay)) {
    returnedDate = format(currentDate, "yyyyMMdd");
    return returnedDate;
  }
  if (currentDay >= inputDay) {
    newDate = addMonths(currentDate, 1);
    newDate = format(newDate, "yyyyMMdd");
    returnedDate = newDate.slice(0, 6) + inputDay.toString().padStart(2, "0");
  } else if (currentDay < inputDay) {
    newDate = currentDate;
    newDate = format(newDate, "yyyyMMdd");
    returnedDate = newDate.slice(0, 6) + inputDay.toString().padStart(2, "0");
  }
  return returnedDate;
};
