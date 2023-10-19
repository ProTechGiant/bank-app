export const hideBalance = (balance: number): string => {
  return balance.toFixed(2).replace(/[0-9]/g, "*");
};
