import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export const getTimeDifference = (date?: string) => {
  if (!date) return;

  const currentDate = new Date();
  const lastDate = new Date(date);

  const minutesDiff = differenceInMinutes(currentDate, lastDate);
  const hoursDiff = differenceInHours(currentDate, lastDate);
  const daysDiff = differenceInDays(currentDate, lastDate);
  const monthsDiff = differenceInMonths(currentDate, lastDate);
  const yearsDiff = differenceInYears(currentDate, lastDate);

  if (minutesDiff < 60) {
    return `${minutesDiff} min`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hr`;
  } else if (daysDiff < 30) {
    return `${daysDiff} day`;
  } else if (monthsDiff < 12) {
    return `${monthsDiff} month`;
  } else {
    return `${yearsDiff} year`;
  }
};
