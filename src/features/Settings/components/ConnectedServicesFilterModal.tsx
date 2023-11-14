import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { DropdownInput } from "@/components/Input";
import Pill from "@/components/Pill";
import { useThemeStyles } from "@/theme";

import {
  ConnectedServicesCurrentFilterOptions,
  ConnectedServicesHistoryFilterOptions,
  ConnectedServicesStatus,
  ConnectedServicesTabTypes,
} from "../constants";
import { ConnectedServicesFilterInterface, TppInfoInterface } from "../types";

interface ConnectedServicesInfoModalProps {
  isVisible: boolean;
  preSelectedTppId?: string;
  onClose: () => void;
  appliedFilters: ConnectedServicesFilterInterface | null;
  onClearAll: () => void;
  currentTab: ConnectedServicesTabTypes;
  onApplyFilter: (status?: ConnectedServicesStatus[], createDate?: string, tppId?: string) => void;
  tppList: { TPPInfo: Omit<TppInfoInterface, "TPPLogo"> }[];
}

export default function ConnectedServicesFilterModal({
  onClearAll,
  isVisible,
  onClose,
  onApplyFilter,
  tppList,
  preSelectedTppId,
  appliedFilters,
  currentTab,
}: ConnectedServicesInfoModalProps) {
  const { t, i18n } = useTranslation();
  const [selectedTppId, setSelectedTppId] = useState<string | undefined>();
  const [selectedFilters, setSelectedFilters] = useState<ConnectedServicesFilterInterface | null>(null);

  useEffect(() => {
    setSelectedFilters(appliedFilters ?? null);
  }, [appliedFilters, currentTab, isVisible]);

  useEffect(() => {
    setSelectedTppId(preSelectedTppId);
  }, [preSelectedTppId]);

  const selectBoxOptions = useMemo(
    () =>
      tppList.map(tpp => ({
        label: i18n.language === "ar" ? tpp.TPPInfo.TPPNameArabic : tpp.TPPInfo.TPPNameEnglish,
        value: tpp.TPPInfo.TPPId,
      })),
    [tppList, i18n.language]
  );

  const handleOnSelectFilter = (creationDateFilter?: string, statusFilter?: ConnectedServicesStatus) => {
    setSelectedFilters(prevFilters => {
      if (!prevFilters) {
        return {
          creationDateFilter: creationDateFilter ?? "",
          statusFilters: statusFilter ? [statusFilter] : [],
        };
      }

      const selectedFiltersCopy = { ...prevFilters };

      if (creationDateFilter !== undefined) {
        const isSelected = selectedFiltersCopy.creationDateFilter === creationDateFilter;
        selectedFiltersCopy.creationDateFilter = isSelected ? undefined : creationDateFilter;
      } else if (statusFilter) {
        const filterIndex = selectedFiltersCopy.statusFilters.indexOf(statusFilter);
        if (filterIndex > -1) {
          selectedFiltersCopy.statusFilters.splice(filterIndex, 1);
        } else {
          selectedFiltersCopy.statusFilters.push(statusFilter as ConnectedServicesStatus);
        }
      }
      return selectedFiltersCopy;
    });
  };

  const handleOnClearAll = () => {
    setSelectedFilters(null);
    onClearAll();
    setSelectedTppId(undefined);
  };

  const handleOnApplyFilter = () => {
    if (currentTab === ConnectedServicesTabTypes.CURRENT) {
      onApplyFilter(undefined, selectedFilters?.creationDateFilter, selectedTppId);
    } else {
      onApplyFilter(selectedFilters?.statusFilters, undefined, selectedTppId);
    }
  };

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const pillContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    gap: theme.spacing["16p"],
  }));

  const pillRowStyle = useThemeStyles<TextStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexWrap: "wrap",
  }));

  const buttonContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["8p"],
    gap: theme.spacing["8p"],
  }));

  const renderFilterOptions = () => {
    const filterOptions =
      currentTab === ConnectedServicesTabTypes.CURRENT
        ? ConnectedServicesCurrentFilterOptions
        : ConnectedServicesHistoryFilterOptions;

    return (
      <Stack direction="vertical" style={pillContainerStyle} align="stretch">
        <Typography.Text size="callout" weight="medium" color="neutralBase-10">
          {t(
            `Settings.ConnectedServicesScreen.FilterModal.${
              currentTab === ConnectedServicesTabTypes.CURRENT ? "creationDateInPast" : "status"
            }`
          )}
        </Typography.Text>
        <Stack direction="horizontal" style={pillRowStyle}>
          {filterOptions.map(value => (
            <Pill
              key={value}
              isActive={
                currentTab === ConnectedServicesTabTypes.CURRENT
                  ? selectedFilters?.creationDateFilter === value
                  : selectedFilters?.statusFilters?.includes(value as ConnectedServicesStatus)
              }
              onPress={() =>
                handleOnSelectFilter(
                  currentTab === ConnectedServicesTabTypes.CURRENT ? value : undefined,
                  currentTab === ConnectedServicesTabTypes.HISTORY ? (value as ConnectedServicesStatus) : undefined
                )
              }>
              {currentTab === ConnectedServicesTabTypes.CURRENT
                ? t(`Settings.ConnectedServicesScreen.Months.${value}`)
                : t(`Settings.ConnectedServicesScreen.${value}`)}
            </Pill>
          ))}
        </Stack>
      </Stack>
    );
  };

  return (
    <Modal visible={isVisible} onClose={onClose} headerText="Filter">
      <Typography.Text style={titleStyle} weight="medium" size="callout">
        {t("Settings.ConnectedServicesScreen.FilterModal.providerName")}
      </Typography.Text>
      <DropdownInput
        label={t("Settings.ConnectedServicesScreen.FilterModal.select")}
        buttonLabel=""
        onChange={tpp => setSelectedTppId(tpp)}
        options={selectBoxOptions}
        value={selectedTppId}
      />
      {renderFilterOptions()}
      <Stack direction="vertical" align="stretch" style={buttonContainerStyle}>
        <Button onPress={handleOnApplyFilter}>{t("Settings.ConnectedServicesScreen.set")}</Button>
        <Button onPress={handleOnClearAll} variant="tertiary">
          {t("Settings.ConnectedServicesScreen.clearAll")}
        </Button>
      </Stack>
    </Modal>
  );
}
