import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ConnectedServicesTabTypes } from "../constants";
import { ConnectedServicesFilterInterface, TppInfoInterface } from "../types";

interface ConnectedServicesAppliedFilterPillsProps {
  appliedFilters: ConnectedServicesFilterInterface | null;
  currentTab: ConnectedServicesTabTypes;
  onRemove: (filter: string, isTpp?: boolean) => void;
  selectedTpp: Omit<TppInfoInterface, "TPPLogo"> | null;
}

export default function ConnectedServicesAppliedFilterPills({
  appliedFilters,
  onRemove,
  currentTab,
  selectedTpp,
}: ConnectedServicesAppliedFilterPillsProps) {
  const { t, i18n } = useTranslation();

  const appliedFiltersArray = useMemo(() => {
    if (!appliedFilters) return [];
    if (currentTab === ConnectedServicesTabTypes.CURRENT) {
      if (appliedFilters.creationDateFilter) {
        return [appliedFilters.creationDateFilter];
      } else {
        return [];
      }
    } else {
      return appliedFilters.statusFilters;
    }
  }, [appliedFilters, currentTab]);

  const filterContainerStyle = useThemeStyles(theme => ({
    gap: theme.spacing["8p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 2,
    borderColor: theme.palette.primaryBase,
    marginBottom: theme.spacing["4p"],
    justifyContent: "space-between",
  }));

  const filterSpacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  const renderFilterPill = (label: string, value: string, isTpp?: boolean) => (
    <Pressable key={value} onPress={() => onRemove(value, isTpp)} style={optionContainerStyle}>
      <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
        {label}
      </Typography.Text>
      <Stack direction="vertical" style={filterSpacingStyle}>
        <CloseIcon width={14} height={18} />
      </Stack>
    </Pressable>
  );

  return (
    <Stack direction="horizontal" align="center" style={filterContainerStyle}>
      <Typography.Text color="neutralBase" size="footnote" weight="regular">
        {t("Settings.ConnectedServicesScreen.filterBy")}
      </Typography.Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {appliedFiltersArray
          ? appliedFiltersArray.map(value => {
              return renderFilterPill(
                currentTab === ConnectedServicesTabTypes.CURRENT
                  ? t(`Settings.ConnectedServicesScreen.Months.${value}`)
                  : t(`Settings.ConnectedServicesScreen.${value}`),
                value
              );
            })
          : null}
        {selectedTpp
          ? renderFilterPill(
              i18n.language === "ar" ? selectedTpp.TPPNameArabic : selectedTpp.TPPNameEnglish,
              selectedTpp.TPPId,
              true
            )
          : null}
      </ScrollView>
    </Stack>
  );
}
