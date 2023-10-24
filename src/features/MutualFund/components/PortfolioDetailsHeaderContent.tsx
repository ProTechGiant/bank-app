import { useState } from "react";
import { useTranslation } from "react-i18next";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Chip from "@/components/Chip";

import { ArrowDown, ArrowUp } from "../assets/icons";
import { PortfolioDetails, PortfolioPerformanceList } from "../types";
import MutualFundCustomChart from "./MutualFundCustomChart";

interface PortfolioDetailsHeaderContentProps {
  portfolioChartLine?: PortfolioPerformanceList;
  PortfolioPerformanceLineChartColorIndex: number;
  portfolioDetails?: PortfolioDetails;
}

export default function PortfolioDetailsHeaderContent({
  portfolioChartLine,
  PortfolioPerformanceLineChartColorIndex,
  portfolioDetails,
}: PortfolioDetailsHeaderContentProps) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState("7D");
  const durationArray = ["1D", "7D", "1M", "3M", "6M", "1Y"];

  return (
    <Stack direction="vertical" gap="4p" align="stretch">
      <Stack direction="vertical" gap="4p">
        <Stack direction="horizontal" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalPortfolioLabel")}
          </Typography.Text>
          <InfoCircleIcon color="#FFFFFF" />
        </Stack>
        <Typography.Text size="title1" weight="bold" color="neutralBase-60">
          {portfolioDetails?.TotalPortfolioValue ?? ""}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalCashBalanceLabel")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {`${portfolioDetails?.TotalCashBalance ?? "0"} ${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" align="flex-end">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalGainLossLabel")}
          </Typography.Text>
          {portfolioDetails !== undefined ? (
            <Stack direction="horizontal" gap="4p" align="center">
              <Typography.Text
                color={
                  portfolioDetails?.TotalGainLossPercentage >= 0 ? "successBase" : "errorBase"
                }>{`${portfolioDetails?.TotalGainLoss} (${portfolioDetails?.TotalGainLossPercentage}%)`}</Typography.Text>
              {portfolioDetails?.TotalGainLossPercentage >= 0 ? (
                <ArrowUp color="#00AC86" />
              ) : (
                <ArrowDown color="#821717" />
              )}
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
      <Stack direction="vertical" gap="8p">
        <Stack direction="horizontal" gap="8p">
          {durationArray.map(duration => {
            return (
              <Chip
                key={duration}
                onPress={() => setSelectedDuration(duration)}
                title={duration}
                isRemovable={false}
                isSelected={duration === selectedDuration}
                isDark={true}
              />
            );
          })}
        </Stack>
        {portfolioChartLine !== undefined ? (
          <MutualFundCustomChart
            tickLabelsColor="#F2F2F2"
            gridStrokeColor="#F2F2F2"
            chartBorderColor="#00334C"
            chartBackgroundColor="#00334C"
            PortfolioPerformanceLineChartColorIndex={PortfolioPerformanceLineChartColorIndex}
            mutualFundCustomChartList={[portfolioChartLine]}
          />
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
}
