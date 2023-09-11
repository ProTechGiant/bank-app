export const formatAccountNumber = (accountNumberValue: string) => {
  return accountNumberValue.replace(/.{1,3}/g, "$& ");
};
