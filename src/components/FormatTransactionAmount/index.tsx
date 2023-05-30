import React from "react";

import Typography from "@/components/Typography";
import { Theme } from "@/theme";

interface FormatTransactionAmountProps {
  amount: number;
  isPlusSignIncluded: boolean;
  color: keyof Theme["palette"];
  isCurrencyIncluded: boolean;
  currencyColor?: keyof Theme["palette"];
  integerSize: keyof Theme["typography"]["text"]["sizes"];
  decimalSize: keyof Theme["typography"]["text"]["sizes"];
}

export default function FormatTransactionAmount({
  amount,
  isPlusSignIncluded,
  color,
  currencyColor,
  isCurrencyIncluded,
  integerSize,
  decimalSize,
}: FormatTransactionAmountProps) {
  const sign = isPlusSignIncluded && amount > 0 ? "+" : "";
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [wholePart, decimalPart] = formattedAmount.split(".");

  return (
    <>
      <Typography.Text color={color} size={integerSize} weight="semiBold">
        {sign}
        {wholePart}
      </Typography.Text>
      <Typography.Text color={color} size={decimalSize} weight="semiBold">
        .{decimalPart}
      </Typography.Text>
      {isCurrencyIncluded ? (
        <Typography.Text color={currencyColor} size={decimalSize} weight="semiBold">
          SAR
        </Typography.Text>
      ) : null}
    </>
  );
}
