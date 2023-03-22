export default function westernArabicNumerals(input: string) {
  return input.replace(EASTERN_ARABIC_NUMERALS, character => {
    return String(character.charCodeAt(0) & 0xf);
  });
}

// All Persian/Arabic Digit in range of their Unicode with a global RegEx character set
const EASTERN_ARABIC_NUMERALS = /[\u0660-\u0669\u06f0-\u06f9]/g;
