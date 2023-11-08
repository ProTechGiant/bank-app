import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { RecurringIcon, RoundsIcon } from "../assets/icons";
import ContributionMethodSection from "./ContributionMethodSection";

interface ContributionMethodModalProps {
  isVisible: boolean;
  onClose: () => void;
  onValueChange?: (selectedValue: string[]) => void;
}

export default function ContributionMethodModal({ isVisible, onClose, onValueChange }: ContributionMethodModalProps) {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const optionAbbreviations = {
    recurring: t("GoalGetter.ShapeYourGoalContributions.Percentage"),
    roundsUp: t("GoalGetter.ShapeYourGoalContributions.RoundsUp"),
    percentage: t("GoalGetter.ShapeYourGoalContributions.Recurring"),
  };
  useEffect(() => {
    onValueChange?.(selectedOptions);
  }, [selectedOptions, onValueChange]);

  const toggleOption = (optionKey: string) => {
    const optionAbbreviation = optionAbbreviations[optionKey];

    if (selectedOptions.includes(optionAbbreviation)) {
      setSelectedOptions(selectedOptions.filter(item => item !== optionAbbreviation));
    } else {
      setSelectedOptions([...selectedOptions, optionAbbreviation]);
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["32p"],
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopLeftRadius: theme.radii.xlarge,
    borderTopRightRadius: theme.radii.xlarge,
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["24p"],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <View style={headerContainerStyle}>
          <NavHeader
            withBackButton={false}
            title={t("GoalGetter.ShapeYourGoalContributions.selectYourMethods")}
            end={<NavHeader.CloseEndButton onPress={onClose} />}
          />
        </View>
        <View style={contentStyle}>
          <ContributionMethodSection
            icon={<RecurringIcon />}
            optionKey="recurring"
            texts={["Recurring", "To contribute the same amount scheduled repeatedly monthly or weekly"]}
            isSelected={selectedOptions.includes(optionAbbreviations.recurring)}
            toggleOption={toggleOption}
          />

          <ContributionMethodSection
            icon={<RoundsIcon />}
            optionKey="roundsUp"
            texts={["Rounds up", "To contribute the rounds of your transactions (only one savings at a time)"]}
            isSelected={selectedOptions.includes(optionAbbreviations.roundsUp)}
            toggleOption={toggleOption}
          />

          <ContributionMethodSection
            icon={<RoundsIcon />}
            optionKey="percentage"
            texts={["Percentage", "To contribute a specified percentage of your earnings."]}
            isSelected={selectedOptions.includes(optionAbbreviations.percentage)}
            toggleOption={toggleOption}
          />
        </View>
      </View>
    </Modal>
  );
}
