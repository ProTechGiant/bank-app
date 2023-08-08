export default function formatCurrency(amount: number, currency?: string, decimalDigits?: number) {
  const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: decimalDigits ?? 0 });
  const monetary = formatter.format(amount);
  return currency === undefined ? monetary : `${monetary} ${currency}`;
}
