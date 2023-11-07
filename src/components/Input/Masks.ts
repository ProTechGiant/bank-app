export const Masks = {
  ACCOUNT_NUMBER: [/\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/],
  ACCOUNT_NUMBER_ARB: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  NATIONAL_ID: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
  IBAN: [
    // eslint-disable-next-line prettier/prettier
    "S", "A", /\d/, /\d/, " ",
    // eslint-disable-next-line prettier/prettier
    /\d/, /\d/, /\d/, /\d/, " ",
    // eslint-disable-next-line prettier/prettier
    /\d/, /\d/, /\d/, /\d/, " ",
    // eslint-disable-next-line prettier/prettier
    /\d/, /\d/, /\d/, /\d/, " ",
    // eslint-disable-next-line prettier/prettier
    /\d/, /\d/, /\d/, /\d/, " ",
    // eslint-disable-next-line prettier/prettier
    /\d/, /\d/, /\d/, /\d/
  ],
};
