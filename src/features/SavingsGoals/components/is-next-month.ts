// left >= right
export default function isNextMonth(date: Date, reference: Date = new Date()) {
  if (date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth() + 1) {
    return true; // next month in current year
  }

  if (date.getFullYear() === reference.getFullYear() + 1 && date.getMonth() === 0 && reference.getMonth() === 11) {
    return true; // first month of next year
  }

  return false;
}
