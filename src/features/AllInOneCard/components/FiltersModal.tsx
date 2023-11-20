import { isBefore } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import useThemeStyles from "@/theme/use-theme-styles";

import { CurrencyTypeIcon, TransactionDateIcon, TransactionTypeIcon } from "../assets/icons";
import DeleteIcon from "../assets/icons/DeleteIcon";
import { mockTransactions as transactions } from "../mocks";
import { TransactionItem } from "../types";
import { parseDate } from "../utils/parseDate";
import Accordion from "./Accordion";
import CurrencyTypes from "./CurrencyTypes";
import TransactionDate from "./TransactionDate ";
import TransactionTypes from "./TransactionTypes";

interface FiltersModalProps {
  isFilterModalVisible: boolean;
  closeModal: () => void;
  setFilteredTransactions: (filteredTransactions: TransactionItem[]) => void;
}

export default function FiltersModal({ isFilterModalVisible, closeModal, setFilteredTransactions }: FiltersModalProps) {
  const { t } = useTranslation();
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);

  const handleAccordionToggle = (index: number) => {
    if (index === openAccordionIndex) {
      setOpenAccordionIndex(null);
    } else {
      setOpenAccordionIndex(index);
    }
  };

  const handleApplyFilter = () => {
    let shownTransactions: TransactionItem[] = [...transactions];
    setFilteredTransactions(transactions);
    if (selectedCurrencies.length === 0 && selectedTransactionTypes.length === 0 && (!startDay || !endDay))
      closeModal();
    else {
      if (selectedTransactionTypes.length > 0) {
        shownTransactions = shownTransactions.filter(transaction =>
          selectedTransactionTypes.includes(transaction.TransactionType)
        );
      }
      if (selectedCurrencies.length !== 0 && !selectedCurrencies.includes("All")) {
        shownTransactions = shownTransactions.filter(transaction => selectedCurrencies.includes(transaction.Currency));
      }

      if (startDay && endDay) {
        shownTransactions = shownTransactions.filter(transaction => {
          const transactionDate = parseDate(transaction.TransactionDate);
          if (transactionDate) {
            return isBefore(transactionDate, new Date(endDay)) && isBefore(new Date(startDay), transactionDate);
          }
          return false;
        });
      }
      setFilteredTransactions(shownTransactions);
      closeModal();
    }
  };

  const handleResetFilter = () => {
    setSelectedCurrencies([]);
    setSelectedTransactionTypes([]);
    setStartDay(null);
    setEndDay(null);
    setOpenAccordionIndex(null);
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
    <Modal visible={isFilterModalVisible}>
      <View style={modalContentStyle}>
        <Stack direction="horizontal" justify="space-between">
          <Pressable onPress={closeModal}>
            <CloseIcon color="#1E1A25" width={24} height={24} />
          </Pressable>

          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.title")}
          </Typography.Text>
          <Pressable onPress={handleResetFilter}>
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
            <Accordion
              title={t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.currencyType")}
              icon={<CurrencyTypeIcon />}
              isExpanded={openAccordionIndex === 2}
              onToggle={() => handleAccordionToggle(2)}>
              <CurrencyTypes selectedCurrencies={selectedCurrencies} setSelectedCurrencies={setSelectedCurrencies} />
            </Accordion>
          </Stack>

          <Button onPress={handleApplyFilter}>
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterModal.applyButton")}{" "}
          </Button>
        </Stack>
      </View>
    </Modal>
  );
}
