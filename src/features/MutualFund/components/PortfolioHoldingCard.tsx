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
  selectedHoldingPortfolio: string;
  portfolioHoldingList: PortfolioHolding[];
  selectedPortfolio: number;
}

export default function PortfolioHoldingCard({
  selectedHoldingPortfolio,
  portfolioHoldingList,
  selectedPortfolio,
}: PortfolioHoldingCardProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [productName, setProductName] = useState(selectedHoldingPortfolio);

  useEffect(() => {
    setProductName(selectedHoldingPortfolio);
  }, [selectedPortfolio]);

  const handleOnClose = () => {
    setIsVisible(false);
  };

  const handleOnPress = () => {
    setIsVisible(true);
  };

  const handleOnSelectPortfolioHolding = () => {
    setProductName(portfolioHoldingList[selected].productInformation.productName);
    setIsVisible(false);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <>
      <Pressable onPress={handleOnPress}>
        <View style={containerStyle}>
          <Stack direction="horizontal" gap="16p" justify="space-between" align="center">
            <Typography.Text color="neutralBase" size="callout" weight="regular">
              {productName}
            </Typography.Text>
            <ChevronBottomIcon color={iconColor} />
          </Stack>
        </View>
      </Pressable>

      <Modal visible={isVisible} onClose={handleOnClose} headerText={t("MutualFund.SubscriptionScreen.selectAccount")}>
        {portfolioHoldingList ? (
          <RadioButtonGroup onPress={value => setSelected(value)} value={selected}>
            {portfolioHoldingList.map((portfolioHolding, index) => {
              return <RadioButton label={portfolioHolding.productInformation.productName} value={index} />;
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
