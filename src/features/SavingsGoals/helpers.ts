import { addMonths, format, isValid, lastDayOfMonth } from "date-fns";

import { SavingsPotDetailsResponse } from "./types";

export const getDayFromDate = (date: string) => {
  return new Date(date).getDate();
};

export const calculateGoalBalanceOverThreeQuarters = (data: SavingsPotDetailsResponse) => {
  const savingsPotGoal = parseInt(data.TargetAmount, 10);
  const availableSavingsPotBalance = parseInt(data.AvailableBalanceAmount, 10);
  const threeQuartersOfGoal = savingsPotGoal * 0.75;
  const difference = savingsPotGoal - availableSavingsPotBalance;

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

export const setDateAndFormatRecurringPayment = (inputDay: number, dateFormat = "yyyyMM") => {
  if (Number.isNaN(inputDay)) {
    return "";
  }

  let currentDate = new Date();
  let newDate;

  currentDate = currentDate.getDate() >= inputDay ? addMonths(currentDate, 1) : currentDate;
  newDate = format(currentDate, dateFormat) + inputDay.toString().padStart(2, "0");

  // check if its a valid end of month date
  if (inputDay > 28 && !isValid(new Date(currentDate.getFullYear(), currentDate.getMonth(), inputDay))) {
    newDate = format(lastDayOfMonth(currentDate), `${dateFormat}dd`);
  }

  return newDate;
};
