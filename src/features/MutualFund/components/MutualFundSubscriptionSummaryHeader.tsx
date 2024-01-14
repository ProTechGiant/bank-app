import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { CheckProductRiskResponse } from "../types";
import MutualFundBrandDivider from "./MutualFundBrandDivider";

interface MutualFundDetailsHeaderProps {
  checkProductRiskData?: CheckProductRiskResponse;
  startingAmount?: string;
}

export default function MutualFundDetailsHeader({
  checkProductRiskData,
  startingAmount,
}: MutualFundDetailsHeaderProps) {
  const { t } = useTranslation();

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
  }));

  return (
    <Stack direction="vertical" align="stretch">
      <Stack direction="vertical" gap="16p" align="stretch" style={contentContainerStyle}>
        <Stack direction="vertical" gap="8p">
          <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
            {t("MutualFund.SubscriptionSummaryScreen.fundName")}
          </Typography.Text>
          <Typography.Text color="supportBase-30" size="title3" weight="medium">
            {checkProductRiskData?.ProductName}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="space-between" gap="16p">
          <Stack direction="vertical" gap="8p">
            <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
              {t("MutualFund.SubscriptionSummaryScreen.numberOfUnits")}
            </Typography.Text>
            <Typography.Text color="supportBase-30" size="title3" weight="medium">
              {Math.ceil(Number(startingAmount?.replace(/,/g, "")) / checkProductRiskData?.CurrentPrice)}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" align="flex-end" gap="8p">
            <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
              {t("MutualFund.SubscriptionSummaryScreen.unitsValue")}
            </Typography.Text>
            <Typography.Text color="supportBase-30" size="title3" weight="medium">
              {t("MutualFund.SubscriptionSummaryScreen.unitConvert", { value: checkProductRiskData?.CurrentPrice })}
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="16p">
          <Stack direction="vertical" gap="8p">
            <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
              {t("MutualFund.SubscriptionSummaryScreen.fundRisk")}
            </Typography.Text>
            <Typography.Text color="supportBase-30" size="title3" weight="medium">
              {checkProductRiskData?.RiskLevel}
            </Typography.Text>
          </Stack>
        </Stack>
      </Stack>
      <MutualFundBrandDivider />
    </Stack>
  );
}
