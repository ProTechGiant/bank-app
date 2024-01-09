import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ArrowUp } from "../assets/icons";
import { useGetProductDetails } from "../hooks/query-hooks";

interface ProductDetailsHeaderProps {
  id: number;
}

export default function ProductDetailsHeader({ id }: ProductDetailsHeaderProps) {
  const { t } = useTranslation();
  const { data } = useGetProductDetails(id);
  const variant =
    data?.RiskLevel === "High Risk"
      ? "pink"
      : data?.RiskLevel === "Mid Risk"
      ? "yellow"
      : data?.RiskLevel === "Low Risk"
      ? "blue"
      : "default";

  const riskStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["8p"],
      paddingVertical: theme.spacing["4p"],
      borderRadius: theme.radii.extraSmall,
      backgroundColor:
        variant === "blue"
          ? theme.palette["secondary_blueBase-20"]
          : variant === "yellow"
          ? theme.palette["secondary_yellowBase-30"]
          : variant === "pink"
          ? theme.palette["secondary_pinkBase-30"]
          : undefined,
    }),
    [variant]
  );

  return (
    <Stack direction="vertical" gap="12p" align="stretch" testID="MutualFund.ProductDetailsHeader:CheckboxInput">
      <Stack direction="vertical" gap="8p" testID="MutualFund.ProductDetailsHeader-inn:CheckboxInput">
        <View style={riskStyle}>
          <Typography.Text size="caption2" color="neutralBase+30" weight="bold">
            {data?.RiskLevel}
          </Typography.Text>
        </View>
        <Typography.Text size="title3" weight="medium" color="neutralBase-60">
          {data?.Name}
        </Typography.Text>
      </Stack>

      <Stack
        direction="vertical"
        gap="4p"
        align="center"
        testID="MutualFund.ProductDetailsHeader-leftContent:CheckboxInput">
        <Stack direction="horizontal" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("MutualFund.DetailsCard.currentValue")}
          </Typography.Text>
          <InfoCircleIcon color="#FAFAFA" />
        </Stack>
        <Stack
          direction="horizontal"
          gap="4p"
          align="center"
          testID="MutualFund.ProductDetailsHeader-rightContent:CheckboxInput">
          <Typography.Text size="large" color="neutralBase-60" weight="medium">
            {data?.CurrentValue}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase-10">
            {` ${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
      </Stack>

      <Stack
        direction="horizontal"
        justify="space-between"
        testID="MutualFund.ProductDetailsHeader-bottom:CheckboxInput">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("MutualFund.ProductDetails.invested")}
          </Typography.Text>
          <Stack direction="horizontal" align="flex-end">
            <Typography.Text color="neutralBase-60" weight="medium" size="title3">
              {data?.InvestedAmount}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase-10">
              {`${t("MutualFund.MutualFundDashboardScreen.currency")}`}
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="horizontal" justify="flex-end">
          <Stack direction="horizontal" justify="flex-end">
            <Stack direction="vertical" gap="4p">
              <Typography.Text size="footnote" color="neutralBase-10" weight="medium">
                {t("MutualFund.ProductDetails.annualReturn")}
              </Typography.Text>
              <Stack direction="horizontal">
                <ArrowUp />
                <Typography.Text size="footnote" color="primaryBase-70" weight="medium">
                  {" "}
                  %{" "}
                </Typography.Text>

                <Typography.Text size="footnote" color="primaryBase-70" weight="medium">
                  {data?.Ytd}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="horizontal" justify="space-between" testID="MutualFund.ProductDetailsHeader-bott:CheckboxInput">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("MutualFund.ProductDetails.numberOfUnits")}
          </Typography.Text>
          <Typography.Text size="title3" color="neutralBase-60" weight="medium">
            {data?.NumberOfUnits}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="flex-end">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="footnote" color="neutralBase-10" weight="medium">
              {t("MutualFund.ProductDetails.totalGain")}
            </Typography.Text>
            <Stack direction="horizontal" align="flex-end">
              <Typography.Text size="title3" color="neutralBase-60" weight="medium">
                {data?.TotalGainLoss}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase-10">
                {` ${t("MutualFund.MutualFundDashboardScreen.currency")}`}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
