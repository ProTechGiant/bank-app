const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 0 });

export default function formatCurrency(amount: number, currency?: string) {
  const monetary = formatter.format(amount);

  return currency === undefined ? monetary : `${monetary} ${currency}`;
}
