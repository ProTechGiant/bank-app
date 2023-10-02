import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

import { formatAmount } from "../utils";

interface FormatTransactionAmountProps {
  amount: number;
  status: string;
}

export default function FormatTransactionAmount({ amount, status }: FormatTransactionAmountProps) {
  const { t } = useTranslation();
  const sign = "+";
  const formattedAmount = formatAmount(amount);
  const [wholePart] = formattedAmount.split(".");

  return (
    <>
      {status === "SUCCESS" ? (
        <>
          <Typography.Text color="successBase" size="callout" weight="semiBold">
            {`${sign} ${wholePart} ${t("GoalGetter.LatestTransactionScreen.SAR")}`}
          </Typography.Text>
        </>
      ) : (
        <Stack direction="vertical">
          <Stack direction="horizontal" style={styles.stackStyle} align="center" justify="flex-end">
            <Typography.Text color="errorBase" size="callout" weight="semiBold">
              {`${sign} ${wholePart} ${t("GoalGetter.LatestTransactionScreen.SAR")}`}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={styles.stackStyle} justify="flex-end">
            <Typography.Text color="errorBase" size="caption1" weight="regular">
              {t("GoalGetter.LatestTransactionScreen.Failed")}
            </Typography.Text>
          </Stack>
        </Stack>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  stackStyle: {
    width: "100%",
  },
});
