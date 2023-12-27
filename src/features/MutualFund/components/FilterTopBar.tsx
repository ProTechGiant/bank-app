import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Pill from "@/components/Pill";
import { useThemeStyles } from "@/theme";

interface FilterSectionProps {
  onFilterChange: (value: string) => void;
  selectedFilter: string;
}

export default function FilterTopBar({ onFilterChange, selectedFilter }: FilterSectionProps) {
  const { t } = useTranslation();
  enum RiskType {
    All = "All",
    Low = "L",
    Medium = "M",
    High = "H",
  }
  const riskTypes = [
    t("MutualFund.ViewOrdersScreen.filterType.all"),
    t("MutualFund.ViewOrdersScreen.filterType.completed"),
    t("MutualFund.ViewOrdersScreen.filterType.pending"),
    t("MutualFund.ViewOrdersScreen.filterType.failed"),
  ];

  const riskCode = {
    [t("MutualFund.ViewOrdersScreen.filterType.all")]: "All",
    [t("MutualFund.ViewOrdersScreen.filterType.completed")]: "L",
    [t("MutualFund.ViewOrdersScreen.filterType.pending")]: "M",
    [t("MutualFund.ViewOrdersScreen.filterType.failed")]: "H",
  };
  const riskTypeTranslations = {
    ["All"]: t("MutualFund.ViewOrdersScreen.filterType.all"),
    ["L"]: t("MutualFund.ViewOrdersScreen.filterType.completed"),
    ["M"]: t("MutualFund.ViewOrdersScreen.filterType.pending"),
    ["H"]: t("MutualFund.ViewOrdersScreen.filterType.failed"),
  };
  const [selectedChips, setSelectedChips] = useState(riskTypes[0]);

  useEffect(() => {
    const mappedChips = mapSelectedFilterToRiskType(selectedFilter);
    if (mappedChips !== null) {
      setSelectedChips(mappedChips);
    } else {
      setSelectedChips("All");
    }
  }, [selectedFilter]);

  const mapSelectedFilterToRiskType = (value: string) => {
    switch (value) {
      case RiskType.All:
        return riskTypeTranslations[RiskType.All];
      case RiskType.Low:
        return riskTypeTranslations[RiskType.Low];
      case RiskType.Medium:
        return riskTypeTranslations[RiskType.Medium];
      case RiskType.High:
        return riskTypeTranslations[RiskType.High];
      default:
        return null;
    }
  };

  const handleChipPress = (chipTitle: string) => {
    onFilterChange(riskCode[chipTitle]);
    setSelectedChips(chipTitle);
  };

  const containerScrollStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["8p"],
    paddingRight: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"] * 2,
    paddingLeft: I18nManager.isRTL ? theme.spacing["20p"] * 2 : theme.spacing["20p"],
    alignItems: "center",
  }));

  return (
    <View style={styles.containerStyle}>
      <ScrollView
        contentContainerStyle={contentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerScrollStyle}>
        {riskTypes.map((chipTitle, index) => (
          <Pill
            key={`${chipTitle} - ${index}`}
            isActive={selectedChips.includes(chipTitle)}
            onPress={() => handleChipPress(chipTitle)}>
            {chipTitle}
          </Pill>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 13,
  },
});
