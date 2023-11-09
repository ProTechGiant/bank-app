import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native"; // Make sure to import View

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { DropdownInput } from "@/components/Input";
import Pill from "@/components/Pill";
import { useThemeStyles } from "@/theme";

import {
  ConnectedServicesCurrentFilterOptions,
  ConnectedServicesHistoryFilterOptions,
  ConnectedServicesTabTypes,
} from "../constants";
import { TppInfoInterface } from "../types";

interface ConnectedServicesInfoModalProps {
  isVisible: boolean;
  selectedTpp: Omit<TppInfoInterface, "TPPLogo"> | null;
  onSelectTpp: (value: string) => void;
  onClose: () => void;
  status: ConnectedServicesTabTypes;
  onApplyFilter: (tppId: string) => void;
  onSelectFilter: (filter: string) => void;
  onClearAll: () => void;
  selectedFilters: string[];
  tppList: Omit<TppInfoInterface, "TPPLogo">[];
}

export default function ConnectedServicesFilterModal({
  isVisible,
  onClose,
  status,
  onApplyFilter,
  onSelectFilter,
  onClearAll,
  selectedFilters,
  tppList,
  onSelectTpp,
  selectedTpp,
}: ConnectedServicesInfoModalProps) {
  const { t, i18n } = useTranslation();

  const selectBoxOptions = useMemo(() => {
    return tppList.map(tpp => {
      return {
        label: i18n.language === "ar" ? tpp.TPPNameArabic : tpp.TPPNameEnglish,
        value: tpp.TPPId,
      };
    });
  }, [tppList]);

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
    if (status === ConnectedServicesTabTypes.CURRENT) {
      return (
        <Stack direction="vertical" style={pillContainerStyle} align="stretch">
          <Typography.Text size="callout" weight="medium" color="neutralBase-10">
            {t("Settings.ConnectedServicesScreen.FilterModal.creationDateInPast")}
          </Typography.Text>
          <Stack direction="horizontal" style={pillRowStyle}>
            {Object.entries(ConnectedServicesCurrentFilterOptions).map(([key, value]) => {
              return (
                <Pill isActive={selectedFilters.includes(value)} onPress={() => onSelectFilter(value)}>
                  {t(`Settings.ConnectedServicesScreen.${key}`)}
                </Pill>
              );
            })}
          </Stack>
        </Stack>
      );
    } else {
      return (
        <Stack direction="vertical" style={pillContainerStyle}>
          <Typography.Text size="callout" weight="medium" color="neutralBase-10">
            {t("Settings.ConnectedServicesScreen.FilterModal.status")}
          </Typography.Text>
          <Stack direction="horizontal" style={pillRowStyle}>
            {Object.entries(ConnectedServicesHistoryFilterOptions).map(([key, value]) => {
              return (
                <Pill isActive={selectedFilters.includes(value)} onPress={() => onSelectFilter(value)}>
                  {t(`Settings.ConnectedServicesScreen.${key}`)}
                </Pill>
              );
            })}
          </Stack>
        </Stack>
      );
    }
  };

  return (
    <Modal visible={isVisible} onClose={onClose} headerText="Filter">
      <Typography.Text style={titleStyle} weight="medium" size="callout">
        {t("Settings.ConnectedServicesScreen.FilterModal.providerName")}
      </Typography.Text>
      <DropdownInput
        label={t("Settings.ConnectedServicesScreen.FilterModal.select")}
        buttonLabel=""
        onChange={tpp => onSelectTpp(tpp)}
        options={selectBoxOptions}
        value={selectedTpp?.TPPId}
      />
      {renderFilterOptions()}
      <Stack direction="vertical" align="stretch" style={buttonContainerStyle}>
        <Button onPress={() => onApplyFilter(selectedTpp?.TPPId ?? "")}>
          {t("Settings.ConnectedServicesScreen.set")}
        </Button>
        <Button onPress={onClearAll} variant="tertiary">
          {t("Settings.ConnectedServicesScreen.clearAll")}
        </Button>
      </Stack>
    </Modal>
  );
}
