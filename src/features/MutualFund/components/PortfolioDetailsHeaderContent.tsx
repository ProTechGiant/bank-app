import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ArrowDown } from "../assets/icons";
import { useGetCustomerPortfolios } from "../hooks/query-hooks";
import PortfoliosListModal from "./PortfoliosListModal";

interface PortfolioDetailsHeaderContentProps {
  onPortfolioSelect: (selectedId: number) => void;
  onPortfolioSelectCode: (selectedId: string) => void;
  PortfoliosMarketValue?: number;
  PortfolioMarketValue?: number;
}

export default function PortfolioDetailsHeaderContent({
  onPortfolioSelect,
  onPortfolioSelectCode,
  PortfoliosMarketValue,
  PortfolioMarketValue,
}: PortfolioDetailsHeaderContentProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPortfolioID, setSelectedPortfolioID] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState();
  const { data: customerPortfolioList, isLoading, error } = useGetCustomerPortfolios();

  useEffect(() => {
    if (customerPortfolioList?.PortfolioList?.length > 0 && !error) {
      const firstPortfolioId = customerPortfolioList.PortfolioList[0].PortfolioId;
      const firstPortfolioCode = customerPortfolioList.PortfolioList[0].PortfolioCode;
      setSelectedPortfolioID(firstPortfolioId);
      setSelectedPortfolio(customerPortfolioList.PortfolioList[0]);
      onPortfolioSelect(firstPortfolioId);
      onPortfolioSelectCode(firstPortfolioCode);
    }
  }, [customerPortfolioList, error]);

  const handleOnClosePortfolioList = () => {
    setIsVisible(false);
  };

  const handlePortfolioSelect = (selectedId: number) => {
    const selected = customerPortfolioList?.PortfolioList.find(portfolio => portfolio.PortfolioId === selectedId);

    if (selected) {
      setSelectedPortfolioID(selected.PortfolioId);
      setSelectedPortfolio(selected);

      onPortfolioSelectCode(selected.PortfolioCode);
      onPortfolioSelect(selected.PortfolioId);
    }
  };

  const changePortfolioContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    borderColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.medium,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
  }));

  return isLoading ? (
    <ActivityIndicator size="small" />
  ) : (
    <Stack direction="vertical" gap="12p" align="stretch" testID="MutualFund.PortfolioDetailsHeaderContent:Stack">
      <Stack direction="vertical" gap="4p">
        <Typography.Text size="footnote" color="neutralBase-60">
          {t("MutualFund.PortfolioDetailsHeaderContent.totalPorValue")}
        </Typography.Text>
        <Typography.Text color="neutralBase-60" weight="bold">
          {PortfoliosMarketValue} {t("MutualFund.MutualFundDashboardScreen.currency")}
        </Typography.Text>
      </Stack>
      <Stack
        direction="horizontal"
        justify="space-between"
        testID="MutualFund.PortfolioDetailsHeaderContent:Inner-Stack">
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("MutualFund.PortfolioDetailsHeaderContent.totalOnePorValue", { porNumber: 1 })}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" weight="bold">
            {PortfolioMarketValue} {`${t("MutualFund.MutualFundDashboardScreen.currency")}`}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="flex-end" testID="MutualFund.PortfolioDetailsHeaderContent-filter:Stack">
          <Pressable
            onPress={() => setIsVisible(!isVisible)}
            style={changePortfolioContainerStyle}
            testID="MutualFund.PortfolioDetailsHeaderContent:Pressable">
            <Stack direction="horizontal" gap="4p">
              <Typography.Text size="footnote" color="neutralBase-60" weight="medium">
                {selectedPortfolio?.PortfolioName}
              </Typography.Text>
              <ArrowDown color="white" />
            </Stack>
          </Pressable>
        </Stack>

        <PortfoliosListModal
          isVisible={isVisible}
          onClose={handleOnClosePortfolioList}
          portfolios={customerPortfolioList?.PortfolioList}
          onSelect={handlePortfolioSelect}
          selectedPortfolioId={selectedPortfolioID}
        />
      </Stack>
    </Stack>
  );
}
