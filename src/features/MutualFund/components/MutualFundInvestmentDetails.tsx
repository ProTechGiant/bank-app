import { useTranslation } from "react-i18next";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";

import { InvestmentDetailsIcon } from "../assets/icons";

export default function MutualFundInvestmentDetails() {
  const { t } = useTranslation();

  // TODO: add props value with api integrations & add translations
  return (
    <Stack direction="vertical" gap="16p" align="stretch">
      <Stack direction="horizontal" gap="12p">
        <InvestmentDetailsIcon />
        <Typography.Text size="title3" weight="medium">
          {t("MutualFund.MutualFundDetailsScreen.InvestmentDetails.title")}
        </Typography.Text>
      </Stack>
      <Divider color="neutralBase-30" />
      <Stack direction="horizontal" gap="12p" justify="space-between">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
            {t("MutualFund.MutualFundDetailsScreen.InvestmentDetails.units")}
          </Typography.Text>
          <Typography.Text size="callout" weight="medium">
            500
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="4p" align="flex-end">
          <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
            {t("MutualFund.MutualFundDetailsScreen.InvestmentDetails.averageCost")}
          </Typography.Text>
          <Typography.Text size="callout" weight="medium">
            19.22
          </Typography.Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" gap="12p" justify="space-between">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" weight="medium" color="neutralBase+10">
            {t("MutualFund.MutualFundDetailsScreen.InvestmentDetails.exchangeRate")}
          </Typography.Text>
          <Typography.Text size="callout" weight="medium">
            13.56
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="4p" align="flex-end">
          <Typography.Text size="footnote" weight="medium" color="neutralBase+10">
            {t("MutualFund.MutualFundDetailsScreen.InvestmentDetails.unrealisedGainLoss")}
          </Typography.Text>
          <Typography.Text size="callout" weight="medium">
            13.56
          </Typography.Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
