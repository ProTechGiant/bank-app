// Function to validate the passcode
export function isPasscodeValid(passcode: string): boolean {
  // Function to check if there are more than 2 consecutive numbers
  function hasMoreThanTwoConsecutiveNumbers(passcode: string): boolean {
    for (let i = 0; i < passcode.length - 2; i++) {
      if (
        parseInt(passcode.charAt(i)) + 1 === parseInt(passcode.charAt(i + 1)) &&
        parseInt(passcode.charAt(i + 1)) + 1 === parseInt(passcode.charAt(i + 2))
      ) {
        return true;
      }
    }
    return false;
  }

  // Function to check if there are more than 2 identical digits
  function hasMoreThanTwoIdenticalDigits(passcode: string): boolean {
    for (let i = 0; i < passcode.length - 2; i++) {
      if (passcode.charAt(i) === passcode.charAt(i + 1) && passcode.charAt(i + 1) === passcode.charAt(i + 2)) {
        return true;
      }
    }
    return false;
  }

  // Check for the conditions
  if (hasMoreThanTwoConsecutiveNumbers(passcode) || hasMoreThanTwoIdenticalDigits(passcode)) {
    return false; // Passcode is not valid
  }

  return true; // Passcode is valid
}
