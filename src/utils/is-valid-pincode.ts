import { numericRegExp } from "@/utils";

export function isSequential(pincode: string): boolean {
  const numbers = "0123456789";
  const reversedNumbers = "9876543210";

  return !(numbers.indexOf(String(pincode)) === -1 && reversedNumbers.indexOf(String(pincode)) === -1);
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

export default function isValidPincode(pincode: string) {
  return !isSequential(pincode) && !isIdentical(pincode) && isContainingValidChars(pincode);
}
