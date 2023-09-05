// Our goal is to display the remaining time until the document's expiration.

export default function convertUTCDateToLocalDate(dateString: string) {
  // Create a Date object from the input UTC date string.
  const date = new Date(dateString);

  // Calculate the milliseconds since the Unix epoch for the local date and time
  // equivalent to the provided UTC date and time.
  const milliseconds = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );

  // Create and return a new Date object representing the local date and time.
  return new Date(milliseconds);
}
