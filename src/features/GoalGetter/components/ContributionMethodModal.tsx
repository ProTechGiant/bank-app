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
  onValueChange?: (selectedValue: string) => void;
}

export default function ContributionMethodModal({ isVisible, onClose, onValueChange }: ContributionMethodModalProps) {
  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    onValueChange?.(selectedOptions);
  }, [selectedOptions, onValueChange]);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
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
        {/* TODO: this section not been translated yet*/}
        <View style={contentStyle}>
          <ContributionMethodSection
            icon={<RecurringIcon />}
            optionKey="recurring"
            texts={["Recurring", "To contribute the same amount scheduled repeatedly monthly or weekly"]}
            isSelected={selectedOptions.includes("recurring")}
            toggleOption={toggleOption}
          />

          <ContributionMethodSection
            icon={<RoundsIcon />}
            optionKey="roundsUp"
            texts={["Rounds up", "To contribute the rounds of your transactions (only one savings at a time)"]}
            isSelected={selectedOptions.includes("roundsUp")}
            toggleOption={toggleOption}
          />

          <ContributionMethodSection
            icon={<RoundsIcon />}
            optionKey="percentage"
            texts={["Percentage", "To contribute a specified percentage of your earnings."]}
            isSelected={selectedOptions.includes("percentage")}
            toggleOption={toggleOption}
          />
        </View>
      </View>
    </Modal>
  );
}
