import { format, parse } from "date-fns";

export const parseGoalDetailDate = (dateString: string): string => {
  const date = parse(dateString, "M/d/yyyy", new Date());
  const formattedDate = format(date, "dd MMM, yyyy");
  return formattedDate;
};
