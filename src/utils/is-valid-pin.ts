import { numericRegExp } from "@/utils";

export function isSequential(pincode: string): boolean {
  const numbers = "0123456789";
  const reversedNumbers = "9876543210";

  return !(numbers.indexOf(String(pincode)) === -1 && reversedNumbers.indexOf(String(pincode)) === -1);
}

export function hasConsecutiveNumbers(passcode: string): boolean {
  for (let i = 0; i < passcode.length - 2; i++) {
    const currentDigit = parseInt(passcode[i], 10);
    const nextDigit = parseInt(passcode[i + 1], 10);
    const nextNextDigit = parseInt(passcode[i + 2], 10);

    if (currentDigit + 1 === nextDigit && nextDigit + 1 === nextNextDigit) {
      return true;
    }
  }

  return false;
}

export function isContainingValidChars(pincode: string): boolean {
  return pincode.match(numericRegExp) !== null;
}

export function isIdentical(pincode: string): boolean {
  const digits = pincode.split("").map(digit => parseInt(digit, 10));

  return digits.every((digit, index) => {
    if (index === 0) return true;
    return digit === digits[index - 1];
  });
}

export function maxRepeatThresholdMet(passcode: string): boolean {
  let repeatingCount = 1;

  for (let i = 1; i < passcode.length; i++) {
    if (passcode[i] === passcode[i - 1]) {
      repeatingCount++;

      if (repeatingCount > 2) {
        return true;
      }
    } else {
      repeatingCount = 1;
    }
  }

  return false;
}

export function isPasscodeIdentical(passcode: string): boolean {
  const digits = passcode.split("");

  return digits.some((digit, index) => digit === digits[index - 1]);
}

export function isValidPincode(pincode: string) {
  return !isSequential(pincode) && !isIdentical(pincode) && isContainingValidChars(pincode);
}
