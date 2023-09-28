import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@/components/Typography";
import { Theme } from "@/theme";

import { formatAmount } from "../utils";

export default function FormatTransactionAmount(
  amount: number,
  isPlusSignIncluded: boolean,
  color: keyof Theme["palette"],
  includeCurrency: boolean
) {
  const { t } = useTranslation();
  const sign = isPlusSignIncluded && amount > 0 ? "+" : "";
  const formattedAmount = formatAmount(amount);
  const [wholePart, decimalPart] = formattedAmount.split(".");

  return (
    <>
      <Typography.Text color={color} size="callout" weight="semiBold">
        {sign}
        {wholePart}
      </Typography.Text>
      <Typography.Text color={color} size="footnote" weight="semiBold">
        .{decimalPart} {includeCurrency ? includeCurrency : t("GoalGetter.goalDetail.sar")}
      </Typography.Text>
    </>
  );
}
