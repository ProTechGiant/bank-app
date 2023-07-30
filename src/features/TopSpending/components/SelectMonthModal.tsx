import { format, lastDayOfMonth, parse, subMonths } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import { useThemeStyles } from "@/theme";

import DiamondIcon from "../assets/icons/DiamondIcon";
import { userType } from "../mocks";
import { PlusTierDateTypes } from "../types";
import DateSelectorForPlusTier from "./DateSelectorForPlusTier";
import DateSelectorForStandardTier from "./DateSelectorForStandardTier";
import SetMonthRowCard from "./SetMonthRowCard";

interface SelectMonthModalProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: (firstDate: string, secondDate?: string) => void;
}

export default function SelectMonthModal({ isVisible, onClose, onContinue }: SelectMonthModalProps) {
  const { t } = useTranslation();
  const { data } = useAccount();
  const currentDate = new Date();
  const openingDate = new Date(data?.currentAccountOpeningDate ?? "");
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const openingYear = openingDate.getFullYear();
  const openingMonth = openingDate.getMonth() + 1;
  const currentMonthName = format(currentDate, "MMMM");
  const lastMonthName = format(subMonths(currentDate, 1), "MMMM");
  const initialPlusTierDates = [
    { month: currentMonth, year: currentYear },
    { month: currentMonth, year: currentYear },
  ];
  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [transactionDateState, setTransactionDateState] = useState<string>(currentMonthName);
  const [comparisonDateState, setComparisonDateState] = useState<string[]>([currentMonthName, lastMonthName]);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState<boolean>(false);
  const [isSecondMonthSelected, setIsSecondMonthSelected] = useState<boolean>(false);
  const [plusTierDates, setPlusTierDates] = useState<PlusTierDateTypes[]>(initialPlusTierDates);

  const resetToDefaults = () => {
    setIsCompare(false);
    setIsMonthPickerVisible(false);
    setIsSecondMonthSelected(false);
    setComparisonDateState([currentMonthName, lastMonthName]);
    setPlusTierDates(initialPlusTierDates);
  };

  const handleOnSelectCheckBox = (item: string) => {
    setComparisonDateState(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return prev.length >= 2 ? [prev[0], item] : [...prev, item];
      }
    });
  };

  const handleOnDateChange = (item: number, type: string) => {
    setPlusTierDates(prev => {
      const dateCopy = [...prev];
      const targetTierIndex = isSecondMonthSelected ? 1 : 0;
      if (type === "month") dateCopy[targetTierIndex].month = item + 1;
      else if (type === "year") dateCopy[targetTierIndex].year = item;
      if (item === currentYear && type === "year") dateCopy[targetTierIndex].month = currentMonth;
      if (item === openingYear) dateCopy[targetTierIndex].month = openingMonth;
      return dateCopy;
    });
  };

  const handleOnClose = () => {
    resetToDefaults();
    onClose();
  };

  const dateFormatter = (item: PlusTierDateTypes | string): string => {
    if (typeof item === "string") {
      const dateString = `${item}`;
      const date = parse(dateString, "MMMM", new Date());
      return format(lastDayOfMonth(date), "yyyy-MM-dd");
    } else {
      const date = new Date();
      date.setFullYear(item.year);
      date.setMonth(item.month - 1);
      return format(lastDayOfMonth(date), "yyyy-MM-dd");
    }
  };

  const handleOnContinue = () => {
    if (isCompare) {
      if (!isSecondMonthSelected) setIsSecondMonthSelected(true);
      else {
        onContinue(dateFormatter(plusTierDates[0]), dateFormatter(plusTierDates[1]));
        handleOnClose();
      }
    } else {
      onContinue(dateFormatter(plusTierDates[0]));
      handleOnClose();
    }
  };

  const handleOnApplyPress = () => {
    if (isCompare) onContinue(dateFormatter(comparisonDateState[0]), dateFormatter(comparisonDateState[1]));
    else onContinue(dateFormatter(transactionDateState));
    handleOnClose();
  };

  const handleOnBackPress = () => setIsMonthPickerVisible(false);

  const renderComponent = () => {
    if (!isMonthPickerVisible)
      return (
        <React.Fragment>
          <DateSelectorForStandardTier
            isCompareModal={isCompare}
            handleOnSelectCheckBox={handleOnSelectCheckBox}
            comparisonDateState={comparisonDateState}
            setTransactionDateState={month => setTransactionDateState(month)}
            transactionDateState={transactionDateState}
          />
          {userType === "plusTier" ? (
            <SetMonthRowCard
              label={t("TopSpending.TopSpendingScreen.SelectMonthModal.viewEarlierMonths")}
              onPressSetDate={() => setIsMonthPickerVisible(true)}
            />
          ) : (
            <Stack direction="horizontal" gap="12p" align="center">
              <DiamondIcon color={diamondIconStyle.color} />
              <Typography.Text size="callout" weight="medium" color="neutralBase-10">
                {t("TopSpending.TopSpendingScreen.SelectMonthModal.plusTier")}
              </Typography.Text>
            </Stack>
          )}
          <View style={buttonsContainerStyle}>
            <Button onPress={handleOnApplyPress}>{t("TopSpending.TopSpendingScreen.SelectMonthModal.apply")}</Button>
            {isCompare ? (
              <Button variant="tertiary" onPress={() => setIsCompare(false)}>
                {t("TopSpending.TopSpendingScreen.SelectMonthModal.cancel")}
              </Button>
            ) : (
              <Button variant="tertiary" onPress={() => setIsCompare(true)}>
                {t("TopSpending.TopSpendingScreen.SelectMonthModal.compare")}
              </Button>
            )}
          </View>
        </React.Fragment>
      );
    else
      return (
        <DateSelectorForPlusTier
          isCompareModal={isCompare}
          selectedDates={plusTierDates}
          isSecondMonthSelected={isSecondMonthSelected}
          openingDate={openingDate}
          onDateChange={handleOnDateChange}
          onContinue={handleOnContinue}
        />
      );
  };

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  const diamondIconStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase-10"],
  }));

  return (
    <Modal
      headerText={
        isCompare
          ? t("TopSpending.TopSpendingScreen.SelectMonthModal.compareMonth")
          : t("TopSpending.TopSpendingScreen.SelectMonthModal.title")
      }
      visible={isVisible}
      onClose={handleOnClose}
      onBack={isMonthPickerVisible ? handleOnBackPress : undefined}>
      {renderComponent()}
    </Modal>
  );
}
