import { useTranslation } from "react-i18next";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";

import { ArrowDown, ArrowUp } from "../assets/icons";
import { Portfolios } from "../types";

interface MutualFundDashboardHeaderContentProps {
  content?: Portfolios;
}

export default function MutualFundDashboardHeaderContent({ content }: MutualFundDashboardHeaderContentProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="vertical" gap="24p" align="stretch">
      <Stack direction="vertical">
        <Stack direction="horizontal" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalPortfolioLabel")}
          </Typography.Text>
          <InfoCircleIcon color="#FFFFFF" />
        </Stack>
        <Typography.Text size="title1" weight="bold" color="neutralBase-60">
          {content?.TotalPortfoliosValue ?? ""}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalCashBalanceLabel")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {content?.TotalCashBalance ?? ""}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" align="flex-end">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalGainLossLabel")}
          </Typography.Text>
          {content !== undefined ? (
            <Stack direction="horizontal" gap="4p" align="center">
              <Typography.Text
                color={
                  content?.TotalGainLossPercentage >= 0 ? "successBase" : "errorBase"
                }>{`${content?.TotalGainLoss} (${content?.TotalGainLossPercentage}%)`}</Typography.Text>
              {content?.TotalGainLossPercentage >= 0 ? <ArrowUp color="#00AC86" /> : <ArrowDown color="#821717" />}
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
