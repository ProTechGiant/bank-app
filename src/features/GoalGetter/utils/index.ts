import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { I18nManager } from "react-native";

import { palette } from "@/theme/values";

export const getDateOfRecurringDay = (recurringDay: string) => {
  const recurringDayNumber = parseInt(recurringDay, 10);

  const currentDate = new Date();

  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  if (currentDate.getDate() >= recurringDayNumber) {
    if (currentMonth === 11) {
      currentYear++;
      currentMonth = 0;
    } else {
      currentMonth++;
    }
    currentDate.setFullYear(currentYear);
    currentDate.setMonth(currentMonth);
  }
  currentDate.setDate(recurringDayNumber);

  const currentMonthName = I18nManager.isRTL
    ? format(currentDate, "MMMM", { locale: arLocale })
    : format(currentDate, "MMMM");
  const formattedDate = `${recurringDayNumber} ${currentMonthName} ${currentDate.getFullYear()}`;

  return formattedDate;
};

export const getProgressColor = (goalTimeAchievePercentage: number, currentAmountPercentageValue: number) => {
  if (currentAmountPercentageValue >= goalTimeAchievePercentage) {
    return {
      backgroundColor: palette.secondary_mintBase,
    };
  } else if (goalTimeAchievePercentage - currentAmountPercentageValue <= 20) {
    return {
      backgroundColor: palette.warningBase,
    };
  } else if (goalTimeAchievePercentage - currentAmountPercentageValue > 20) {
    return {
      backgroundColor: palette.complimentBase,
    };
  }
};
