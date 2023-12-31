export function formatContactNumber(phoneNumber: string) {
  // Remove special characters and spaces
  const cleanedNumber = phoneNumber.replace(/[^\d]/g, "");

  // Extract the last 9 digits
  return cleanedNumber.slice(-9);
}

export function formatContactNumberToSaudi(phoneNumber: string) {
  // Insert spaces or other formatting characters
  const formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  // Add '+966' at the beginning
  return "+966 " + formattedNumber;
}
