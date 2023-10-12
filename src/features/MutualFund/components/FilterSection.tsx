import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Chip from "@/components/Chip";
import Divider from "@/components/Divider";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FilterSectionProps {
  onFilterChange: (value: string) => void;
}
export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const { t } = useTranslation();
  const riskTypes = [
    t("MutualFund.DiscoverProductsScreen.filterType.all"),
    t("MutualFund.DiscoverProductsScreen.filterType.low"),
    t("MutualFund.DiscoverProductsScreen.filterType.medium"),
    t("MutualFund.DiscoverProductsScreen.filterType.high"),
  ];

  const [selectedChips, setSelectedChips] = useState([riskTypes[0]]);

  const handleChipPress = (chipTitle: string) => {
    onFilterChange(chipTitle);
    if (selectedChips.includes(chipTitle)) {
      setSelectedChips((prevState: any) => prevState.filter((chip: string) => chip !== chipTitle));
    } else {
      setSelectedChips((prevState: any) => [...prevState, chipTitle]);
    }
  };

  const containerScrollStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"] * 2,
    paddingLeft: I18nManager.isRTL ? theme.spacing["20p"] * 2 : theme.spacing["20p"],
    alignItems: "center",
  }));

  return (
    <View style={styles.containerStyle}>
      <Divider color="neutralBase-40" />
      <ScrollView
        contentContainerStyle={contentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerScrollStyle}>
        <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
          {t("MutualFund.DiscoverProductsScreen.filterByRisk")}
        </Typography.Text>

        {riskTypes.map((chipTitle, index) => (
          <Chip
            key={`${chipTitle} - ${index}`}
            onPress={() => handleChipPress(chipTitle)}
            title={chipTitle}
            isRemovable={false}
            isSelected={selectedChips.includes(chipTitle)}
          />
        ))}
      </ScrollView>
      <Divider color="neutralBase-40" />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 13,
  },
});
