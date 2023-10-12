import { useState } from "react";
import { useTranslation } from "react-i18next";

import { InfoCircleIcon, TopUpIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Chip from "@/components/Chip";

import { PORTFOLIO_CHART_DATA } from "../mocks/mockData";
import MutualFundCustomChart from "./MutualFundCustomChart";

export default function PortfolioDetailsHeaderContent() {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState("");
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
          {/* TODO: This value will replace with data from API  */}
          5,265.60
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.MutualFundDashboardScreen.TotalCashBalanceLabel")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {/* TODO: This value will replace with data from API  */}
            4,500.00
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
        <MutualFundCustomChart
          tickLabelsColor="#F2F2F2"
          gridStrokeColor="#F2F2F2"
          chartBorderColor="#00334C"
          chartBackgroundColor="#00334C"
          mutualFundCustomChartList={PORTFOLIO_CHART_DATA}
        />
      </Stack>
    </Stack>
  );
}
