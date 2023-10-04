import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface PillsContainerInterface {
  onRemoveFilter: (value: string) => void;
  appliedFilterLabels: string[];
}

export default function PillsContainer({ onRemoveFilter, appliedFilterLabels }: PillsContainerInterface) {
  const { t } = useTranslation();

  const filterContainerStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    marginTop: theme.spacing["24p"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 2,
    gap: theme.spacing["8p"],
    borderColor: theme.palette.primaryBase,
    marginBottom: theme.spacing["4p"],
    justifyContent: "space-between",
  }));

  return (
    <Stack direction="horizontal" align="center" style={filterContainerStyle}>
      <Typography.Text color="neutralBase" size="footnote" weight="regular">
        {t("SavingsGoals.GoalDetailsScreen.AllTransactions.filteredBy")}
      </Typography.Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {appliedFilterLabels.map(type => (
          <Pressable onPress={() => onRemoveFilter(type)} style={optionContainerStyle}>
            <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
              {type}
            </Typography.Text>
            <CloseIcon width={14} height={18} />
          </Pressable>
        ))}
      </ScrollView>
    </Stack>
  );
}
