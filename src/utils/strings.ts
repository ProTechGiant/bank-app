export const pluralize = (length: number, word: string, addition: string) => {
  return `${length} ${word}${length > 1 ? addition : ""}`;
};

export const alphaNumericSpaceRegExp = /^[a-zA-Z0-9 ]+$/;

export const saudiPhoneRegExp = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
