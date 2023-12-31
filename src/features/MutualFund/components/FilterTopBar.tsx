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

  const statusTypes = [
    t("MutualFund.ViewOrdersScreen.filterType.all"),
    t("MutualFund.ViewOrdersScreen.filterType.completed"),
    t("MutualFund.ViewOrdersScreen.filterType.pending"),
    t("MutualFund.ViewOrdersScreen.filterType.failed"),
  ];
  const [selectedChips, setSelectedChips] = useState(statusTypes[0]);

  useEffect(() => {
    const mappedChips = selectedFilter;
    if (mappedChips !== null) {
      setSelectedChips(mappedChips);
    } else {
      setSelectedChips("All");
    }
  }, [selectedFilter]);

  const handleChipPress = (chipTitle: string) => {
    onFilterChange(chipTitle);
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
        {statusTypes.map((chipTitle, index) => (
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
