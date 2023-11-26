export function convertKsaToUtcTime(ksaTime: string): Date {
  // Parse the Saudi date time string
  const utcDate = new Date(ksaTime);

  const currentZoneHourDiff = new Date().getTimezoneOffset() / 60;

  utcDate.setHours(utcDate.getHours() + -currentZoneHourDiff);

  utcDate.setHours(utcDate.getHours() - 3);

  if (isNaN(utcDate.getTime())) {
    console.error("Invalid Saudi date time string");
  }
  return utcDate;
}
