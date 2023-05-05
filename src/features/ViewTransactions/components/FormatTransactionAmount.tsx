import React from "react";

import Typography from "@/components/Typography";
import { Theme } from "@/theme";

export default function FormatTransactionAmount(
  amount: number,
  isPlusSignIncluded: boolean,
  color: keyof Theme["palette"]
) {
  const sign = isPlusSignIncluded && amount > 0 ? "+" : "";
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [wholePart, decimalPart] = formattedAmount.split(".");

  return (
    <>
      <Typography.Text color={color} size="callout" weight="semiBold">
        {sign}
        {wholePart}
      </Typography.Text>
      <Typography.Text color={color} size="footnote" weight="semiBold">
        .{decimalPart}
      </Typography.Text>
    </>
  );
}
