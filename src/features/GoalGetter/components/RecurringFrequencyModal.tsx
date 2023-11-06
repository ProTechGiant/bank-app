import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

interface Portfolio {
  PortfolioId: string;
  PortfolioName: string;
}

interface RecurringFrequencyModalProps {
  isVisible: boolean;
  selected: string;
  list: Portfolio[];
  onClose: () => void;
  onSelect: (value: string | null) => void;
}

export default function RecurringFrequencyModal({
  isVisible,
  selected,
  list,
  onClose,
  onSelect,
}: RecurringFrequencyModalProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopLeftRadius: theme.radii.xlarge,
    borderTopRightRadius: theme.radii.xlarge,
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onClose={onClose}
      headerText={t("MutualFund.SubscriptionScreen.selectAccount")}>
      <View style={containerStyle}>
        <View style={contentStyle}>
          <NavHeader
            withBackButton={false}
            title={t("GoalGetter.ShapeYourGoalContributions.recurringFrequency")}
            end={<NavHeader.CloseEndButton onPress={onClose} />}
          />
          <RadioButtonGroup
            onPress={value => {
              if (value === selected) {
                onSelect(null);
              } else {
                onSelect(value);
              }
            }}
            value={selected}>
            {list.map(portfolio => (
              <RadioButton key={portfolio.PortfolioId} label={portfolio.PortfolioName} value={portfolio.PortfolioId} />
            ))}
          </RadioButtonGroup>
          <View style={buttonContainerStyle}>
            <Button onPress={onClose}>{t("MutualFund.SubscriptionScreen.selectButton")}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
