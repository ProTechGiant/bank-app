import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import useThemeStyles from "@/theme/use-theme-styles";

import { CurrencyTypeIcon, TransactionDateIcon, TransactionTypeIcon } from "../assets/icons";
import DeleteIcon from "../assets/icons/DeleteIcon";
import { useGetCardTransactions } from "../hooks/query-hooks";
import { mockTransactions as transactions } from "../mocks";
import { CardTransactionQuery, TransactionItem } from "../types";
// import { parseDate } from "../utils/parseDate";
import Accordion from "./Accordion";
import CurrencyTypes from "./CurrencyTypes";
import TransactionDate from "./TransactionDate ";
import TransactionTypes from "./TransactionTypes";

interface FiltersModalProps {
  isFilterModalVisible: boolean;
  closeModal: () => void;
  setFilteredTransactions: (filteredTransactions: TransactionItem[]) => void;
  showCurrencyTypeFilter?: boolean;
}

export default function FiltersModal({
  isFilterModalVisible,
  closeModal,
  setFilteredTransactions,
  showCurrencyTypeFilter = true,
}: FiltersModalProps) {
  const { t } = useTranslation();
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | undefined>();
  const filteredTransactions = useGetCardTransactions();
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [startDay, setStartDay] = useState<string | undefined>();
  const [endDay, setEndDay] = useState<string | undefined>();

  const handleAccordionToggle = (index: number) => {
    if (index === openAccordionIndex) {
      setOpenAccordionIndex(undefined);
    } else {
      setOpenAccordionIndex(index);
    }
  };

  const handleApplyFilter = async () => {
    const payload: CardTransactionQuery = {
      CardIdentifierId: "12651651",
      CardIdentifierType: "test",
      FromDate: startDay,
      ToDate: endDay,
      TransactionType: "TEST",
      Currency: "SAR",
      NoOfTransaction: 2,
    }; //TODO: remove this mock payload WHEN API is available and this page be activated
    const filteredTransactionsResponse = await filteredTransactions.mutateAsync(payload);
    setFilteredTransactions(filteredTransactionsResponse.CardTransactions);
    closeModal();
  };

  const handleResetFilter = () => {
    setSelectedCurrencies([]);
    setSelectedTransactionTypes([]);
    setStartDay("");
    setEndDay("");
    setOpenAccordionIndex(undefined);
    setFilteredTransactions([...transactions]);
    closeModal();
  };

  const modalContentStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "98%",
    marginTop: theme.spacing["8p"],
  }));
  const accordionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  return (
    <Modal visible={isFilterModalVisible} testID="AllInOneCard.AllTransactionsScreen:Modal">
      <View style={modalContentStyle}>
        <Stack direction="horizontal" justify="space-between">
          <Pressable onPress={closeModal} testID="AllInOneCard.AllTransactionsScreen:ClosePressable">
            <CloseIcon color="#1E1A25" width={24} height={24} />
          </Pressable>

          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.title")}
          </Typography.Text>
          <Pressable onPress={handleResetFilter} testID="AllInOneCard.AllTransactionsScreen:DeletePressable">
            <DeleteIcon />
          </Pressable>
        </Stack>
        <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
          <Stack direction="vertical" gap="20p" style={accordionsContainerStyle}>
            <Accordion
              title={t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.transactionDate")}
              icon={<TransactionDateIcon />}
              isExpanded={openAccordionIndex === 0}
              onToggle={() => handleAccordionToggle(0)}>
              <TransactionDate startDay={startDay} setStartDay={setStartDay} endDay={endDay} setEndDay={setEndDay} />
            </Accordion>
            <Accordion
              title={t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.transactionType")}
              icon={<TransactionTypeIcon />}
              isExpanded={openAccordionIndex === 1}
              onToggle={() => handleAccordionToggle(1)}>
              <TransactionTypes
                selectedTransactionTypes={selectedTransactionTypes}
                setSelectedTransactionTypes={setSelectedTransactionTypes}
              />
            </Accordion>
            {showCurrencyTypeFilter ? (
              <Accordion
                title={t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.currencyType")}
                icon={<CurrencyTypeIcon />}
                isExpanded={openAccordionIndex === 2}
                onToggle={() => handleAccordionToggle(2)}>
                <CurrencyTypes selectedCurrencies={selectedCurrencies} setSelectedCurrencies={setSelectedCurrencies} />
              </Accordion>
            ) : null}
          </Stack>

          <Button onPress={handleApplyFilter} loading={filteredTransactions.isLoading}>
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.applyButton")}{" "}
          </Button>
        </Stack>
      </View>
    </Modal>
  );
}
