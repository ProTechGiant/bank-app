import React from "react";
import { useTranslation } from "react-i18next";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";

import { ArrowUp } from "../assets/icons";
import { useGetProductDetails } from "../hooks/query-hooks";

interface ProductDetailsHeaderProps {
  id: number;
}

export default function ProductDetailsHeader({ id }: ProductDetailsHeaderProps) {
  const { t } = useTranslation();
  const { data } = useGetProductDetails(id);

  return (
    <Stack direction="vertical" gap="12p" align="stretch" testID="MutualFund.ProductDetailsHeader:CheckboxInput">
      <Stack direction="vertical" gap="4p" testID="MutualFund.ProductDetailsHeader-inn:CheckboxInput">
        <Typography.Text size="footnote" color="neutralBase-60">
          {data?.Name}
        </Typography.Text>
        <Typography.Text color="neutralBase-60" weight="bold">
          {data?.RiskLevel}
        </Typography.Text>
      </Stack>

      <Stack
        direction="vertical"
        gap="4p"
        align="center"
        testID="MutualFund.ProductDetailsHeader-leftContent:CheckboxInput">
        <Stack direction="horizontal" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.DetailsCard.currentValue")}
          </Typography.Text>
          <InfoCircleIcon color="#FAFAFA" />
        </Stack>
        <Stack direction="horizontal" gap="4p" testID="MutualFund.ProductDetailsHeader-rightContent:CheckboxInput">
          <Typography.Text color="neutralBase-60" weight="bold" />
          <Typography.Text size="footnote" color="neutralBase-60">
            {data?.CurrentValue}
            {` ${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
      </Stack>

      <Stack
        direction="horizontal"
        justify="space-between"
        testID="MutualFund.ProductDetailsHeader-bottom:CheckboxInput">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.ProductDetails.invested")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {data?.InvestedAmount}
            {`${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="flex-end">
          <Stack direction="horizontal" justify="flex-end">
            <Stack direction="vertical" gap="4p">
              <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
                {t("MutualFund.ProductDetails.annualReturn")}
              </Typography.Text>
              <Stack direction="horizontal">
                <ArrowUp />
                <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
                  {" "}
                  %{" "}
                </Typography.Text>

                <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
                  {data?.Ytd}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="horizontal" justify="space-between" testID="MutualFund.ProductDetailsHeader-bott:CheckboxInput">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.ProductDetails.numberOfUnits")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {data?.NumberOfUnits}
            {`${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="flex-end">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
              {t("MutualFund.ProductDetails.totalGain")}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
              {data?.TotalGainLoss}
              {`${t("MutualFund.MutualFundDashboardScreen.currency")}`}
            </Typography.Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
