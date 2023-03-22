export const nationalIdRegEx = /^\b[1-2]\d{9}\b/;

export const alphaNumericSpaceRegExp = /^[a-zA-Z0-9 ]+$/;

export const alphaNumericRegExp = /^[a-zA-Z0-9]*$/;

export const alphaNumericSpecialCharsRegExp = /^[a-zA-Z0-9-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\ ]+$/;

export const numericRegExp = /^[0-9]+$/;

export const saudiPhoneRegExp = /^(009665|9665|\+9665|05|5)(5|0|2|3|6|4|9|1|8|7)([0-9]{7})$/;

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
