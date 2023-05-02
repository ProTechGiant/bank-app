import { format } from "date-fns";

export const formattedDateTime = (value: string) => {
  const dateTime = new Date(value);
  // Format: 30 March, 2023  15:45
  return `${format(dateTime, "d MMMM, yyyy")} • ${format(dateTime, "HH:mm")}`;
};
