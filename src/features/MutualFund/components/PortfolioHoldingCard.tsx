import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { ChevronBottomIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { PortfolioHolding } from "../types";

interface PortfolioHoldingCardProps {
  selectedHoldingPortfolioId: string | number;
  portfolioHoldingList: PortfolioHolding[];
  onHoldingPortfolioChange: (value: string | number) => void;
}

export default function PortfolioHoldingCard({
  selectedHoldingPortfolioId,
  portfolioHoldingList,
  onHoldingPortfolioChange,
}: PortfolioHoldingCardProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState<string | number>(selectedHoldingPortfolioId);
  const [productName, setProductName] = useState(portfolioHoldingList?.[0]?.ProductInformation.ProductName ?? "");

  useEffect(() => {
    const selectedPortfolio = portfolioHoldingList.find(
      portfolio => portfolio.ProductInformation.ProductId === selectedHoldingPortfolioId
    );
    setProductName(selectedPortfolio ? selectedPortfolio.ProductInformation.ProductName : "");
    setSelected(selectedHoldingPortfolioId);
  }, [selectedHoldingPortfolioId, portfolioHoldingList]);

  const handleOnClose = () => {
    setIsVisible(false);
    setSelected(selectedHoldingPortfolioId);
  };

  const handleOnPress = () => {
    if (portfolioHoldingList.length > 1) setIsVisible(true);
  };

  const handleOnSelectPortfolioHolding = () => {
    const selectedPortfolio = portfolioHoldingList.find(
      portfolio => portfolio.ProductInformation.ProductId === selected
    );
    setProductName(selectedPortfolio ? selectedPortfolio.ProductInformation.ProductName : "");
    setIsVisible(false);
    onHoldingPortfolioChange(selected);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={labelStyle}>
        {t("MutualFund.SubscriptionScreen.toAccount")}
      </Typography.Text>
      <Pressable onPress={handleOnPress}>
        <View style={containerStyle}>
          <Stack direction="horizontal" gap="16p" justify="space-between" align="center">
            <Typography.Text color="neutralBase" size="callout" weight="regular">
              {productName}
            </Typography.Text>
            <View style={iconContainerStyle}>
              <ChevronBottomIcon color={iconColor} />
            </View>
          </Stack>
        </View>
      </Pressable>

      <Modal visible={isVisible} onClose={handleOnClose} headerText={t("MutualFund.SubscriptionScreen.toAccount")}>
        {portfolioHoldingList ? (
          <RadioButtonGroup onPress={value => setSelected(value)} value={selected}>
            {portfolioHoldingList.map(portfolioHolding => {
              return (
                <RadioButton
                  key={portfolioHolding.ProductInformation.ProductId}
                  label={portfolioHolding.ProductInformation.ProductName}
                  value={portfolioHolding.ProductInformation.ProductId}
                />
              );
            })}
          </RadioButtonGroup>
        ) : null}
        <View style={buttonContainerStyle}>
          <Button onPress={handleOnSelectPortfolioHolding}>{t("MutualFund.SubscriptionScreen.selectButton")}</Button>
        </View>
      </Modal>
    </>
  );
}
