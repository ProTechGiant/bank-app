import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { BeneficiaryType } from "../types";

interface ViewBankFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: BeneficiaryType[] | undefined) => void;
  selectedFilters: BeneficiaryType[];
}

enum ModalScreens {
  Main,
  BySpendingCategory,
  ByCardType,
}

export default function ViewBankFilterModal({
  visible,
  onClose,
  onApplyFilter,
  selectedFilters,
}: ViewBankFilterModalProps) {
  const { t } = useTranslation();

  const centerContentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.transparent,
    paddingBottom: theme.spacing["4p"],
  }));

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    maxHeight: "70%",
  }));

  const [currentScreen, setCurrentScreen] = useState(ModalScreens.Main);
  const [headerText, setHeaderText] = useState(t("ViewTransactions.TransactionsScreen.filterOptions"));
  const [selectedBankFilters, setSelectedBankFilters] = useState(selectedFilters || []);
  const [isDisabled, setDisasbled] = useState<boolean>(true);

  useEffect(() => {
    setSelectedBankFilters(selectedFilters);
  }, [selectedFilters]);

  const handleFilterOptionChange = (screen: ModalScreens, textHeader: string) => {
    setCurrentScreen(screen);
    setHeaderText(textHeader);
  };

  const handleSelectBank = (bankName: string) => {
    setSelectedBankFilters(prevFilters =>
      prevFilters?.map(item => (item?.BankName === bankName ? { ...item, isChecked: !item.isChecked } : item))
    );
    setDisasbled(false);
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedBankFilters);
    onClose();
  };

  const handleOnClearFilter = () => {
    setSelectedBankFilters(selectedFilters);
    setDisasbled(true);
  };

  const filterOptionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const handleGoBackPress = (screen: ModalScreens) => {
    handleFilterOptionChange(screen, t("ViewTransactions.TransactionsScreen.filterOptions"));
  };

  const renderMainScreen = () => {
    return (
      <>
        <View style={centerContentStyle}>
          <View>
            <ScrollView style={{ height: "65%" }}>
              {selectedBankFilters
                ?.filter((bank, index, array) => array.findIndex(b => b.BankName === bank.BankName) === index)
                .map(bank => (
                  <Pressable onPress={() => handleSelectBank(bank.BankName)}>
                    <Stack direction="horizontal" style={filterOptionStyle} align="stretch" justify="space-between">
                      <Typography.Text size="callout" weight="medium">
                        {bank.BankName}
                      </Typography.Text>
                      <CheckboxInput value={bank.isChecked} />
                    </Stack>
                  </Pressable>
                ))}
            </ScrollView>
          </View>

          <View>
            <Button disabled={isDisabled} onPress={handleApplyFilter}>
              {t("ViewTransactions.TransactionsScreen.applyFilter")}
            </Button>
          </View>
          <Button disabled={isDisabled} variant="tertiary" onPress={handleOnClearFilter}>
            {t("ViewTransactions.TransactionsScreen.clearAll")}
          </Button>
        </View>
      </>
    );
  };

  return (
    <Modal
      onBack={
        currentScreen !== ModalScreens.Main
          ? () => handleFilterOptionChange(ModalScreens.Main, t("ViewTransactions.TransactionsScreen.filterOptions"))
          : undefined
      }
      visible={visible}
      onClose={currentScreen !== ModalScreens.Main ? () => handleGoBackPress(ModalScreens.Main) : onClose}
      style={modalStyle}
      headerText={headerText}>
      {currentScreen === ModalScreens.Main ? renderMainScreen() : null}
    </Modal>
  );
}
