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
  selectedHoldingPortfolioName: string;
  portfolioHoldingList: PortfolioHolding[];
  handleHoldingPortfolioChange: (value: string) => void;
}

export default function PortfolioHoldingCard({
  selectedHoldingPortfolioName,
  portfolioHoldingList,
  handleHoldingPortfolioChange,
}: PortfolioHoldingCardProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const [productName, setProductName] = useState(selectedHoldingPortfolioName);

  useEffect(() => {
    setProductName(selectedHoldingPortfolioName);
    setSelected(selectedHoldingPortfolioName);
  }, [selectedHoldingPortfolioName]);

  const handleOnClose = () => {
    setIsVisible(false);
    setSelected(selectedHoldingPortfolioName);
  };

  const handleOnPress = () => {
    if (portfolioHoldingList.length > 1) setIsVisible(true);
  };

  const handleOnSelectPortfolioHolding = () => {
    setProductName(selected);
    setIsVisible(false);
    handleHoldingPortfolioChange(selected);
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
                  label={portfolioHolding.productInformation.productName}
                  value={portfolioHolding.productInformation.productName}
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
