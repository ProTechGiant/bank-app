const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 0 });

export default function formatCurrency(amount: number, currency: string) {
  return `${formatter.format(amount)} ${currency}`;
}
