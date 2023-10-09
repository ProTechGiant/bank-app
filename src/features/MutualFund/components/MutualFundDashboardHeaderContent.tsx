import { useTranslation } from "react-i18next";

import { InfoCircleIcon, TopUpIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";

export default function MutualFundDashboardHeaderContent() {
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
          {/* TODO: This value will replace with data from API  */}
          8,776.00
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalCashBalanceLabel")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {/* TODO: This value will replace with data from API  */}
            3,473 SAR
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" align="flex-end">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalGainLossLabel")}
          </Typography.Text>
          <Stack direction="horizontal" gap="4p">
            <Typography.Text color="successBase">
              {/* TODO: This value will replace with data from API  */}
              3,455.00 (0.05%)
            </Typography.Text>
            <TopUpIcon color="#00AC86" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
