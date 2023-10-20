import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { ChevronBottomIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { Portfolio } from "../types";

interface PortfolioCardProps {
  portfolioName: string;
  balance: number;
  portfolioList: Portfolio[];
  handlePortfolioChange: (value: string) => void;
}

export default function PortfolioCard({
  portfolioName,
  balance,
  portfolioList,
  handlePortfolioChange,
}: PortfolioCardProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(portfolioName);
  const [portfolioCode, setPortfolioCode] = useState(portfolioList?.[0]?.portfolioCode ?? "");

  const handleOnClose = () => {
    setIsVisible(false);
    setSelected(portfolioName);
  };

  const handleOnPress = () => {
    if (portfolioList.length > 1) setIsVisible(true);
  };

  const handleOnSelectPortfolio = () => {
    setIsVisible(false);
    handlePortfolioChange(selected);
    const selectedPortfolio = portfolioList.find(portfolio => portfolio.portfolioName === selected);
    setPortfolioCode(selectedPortfolio ? selectedPortfolio.portfolioCode : "");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={labelStyle}>
        {t("MutualFund.SubscriptionScreen.fromAccount")}
      </Typography.Text>
      <Pressable onPress={handleOnPress} style={containerStyle}>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Stack direction="vertical" gap="4p">
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {portfolioName}
            </Typography.Text>
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {portfolioCode}
            </Typography.Text>
            <Typography.Text color="neutralBase-10" size="caption2" weight="regular">
              {t("MutualFund.SubscriptionScreen.balance")}
              <Typography.Text color="neutralBase-10" size="caption2" weight="bold">
                {balance.toFixed(2)} {t("MutualFund.SubscriptionScreen.currency")}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <ChevronBottomIcon color={iconColor} />
        </Stack>
      </Pressable>

      <Modal visible={isVisible} onClose={handleOnClose} headerText={t("MutualFund.SubscriptionScreen.selectAccount")}>
        {portfolioList ? (
          <RadioButtonGroup onPress={value => setSelected(value)} value={selected}>
            {portfolioList.map(portfolio => {
              return <RadioButton label={portfolio.portfolioName} value={portfolio.portfolioName} />;
            })}
          </RadioButtonGroup>
        ) : null}
        <View style={buttonContainerStyle}>
          <Button onPress={handleOnSelectPortfolio}>{t("MutualFund.SubscriptionScreen.selectButton")}</Button>
        </View>
      </Modal>
    </>
  );
}
