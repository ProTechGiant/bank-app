import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import { CheckboxInput } from "@/components/Input";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useUpdateCategory } from "../hooks/query-hooks";
import { TransactionDetailed } from "../types";

interface SimilarModalProps {
  visible: boolean;
  onClose: () => void;
  similarTransactions: Transaction[];
  data: TransactionDetailed;
  createDisputeUserId: string;
  cardId: string;
}

interface Transaction {
  AccountId: string;
  TransactionId: string;
  CardType: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  TransactionInformation: string;
  BookingDateTime: number[];
  ValueDateTime: number[];
  AddressLine: string;
  ChargeAmount: {
    Amount: string;
  };
  Amount: {
    Amount: string;
    Currency: string;
  };
  MerchantDetails: { MerchantName: string };
  SupplementaryData: {
    RoundupAmount: string;
    RoundupCurrency: string;
    CategoryId: string;
    CategoryName: string;
  };
}

export default function SimilarTransactionsModal({
  visible,
  onClose,
  similarTransactions = [],
  data,
  cardId,
  createDisputeUserId,
}: SimilarModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [selectedTransactions, setSelectedTransactions] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (value: boolean) => {
    setSelectAll(value);
    const newSelectedTransactions = similarTransactions.reduce(
      (acc, transaction) => ({ ...acc, [transaction.TransactionId]: value }),
      {}
    );
    setSelectedTransactions(newSelectedTransactions);
  };

  useEffect(() => {
    const areAllTransactionsChecked = similarTransactions.every(
      (transaction: Transaction) => selectedTransactions[transaction.TransactionId]
    );
    if (areAllTransactionsChecked !== selectAll) {
      setSelectAll(areAllTransactionsChecked);
    }
  }, [selectedTransactions]);

  const isSubmitButtonDisabled = () => {
    return similarTransactions.every((transaction: Transaction) => !selectedTransactions[transaction.TransactionId]);
  };

  const updateCategoryMutation = useUpdateCategory();

  const handleOnSubmit = async () => {
    if (!isSubmitButtonDisabled()) {
      const formData = { ...selectedTransactions, selectAll };

      // Extract the transaction ids to be updated
      const transactionIdsToUpdate = Object.entries(formData)
        .filter(([, shouldUpdate]) => {
          return formData.selectAll || shouldUpdate;
        })
        .map(([transactionId, _]) => transactionId);

      const newCategoryId = data.categoryId;
      const merchantName = encodeURIComponent(data.title);
      const oldCategoryId = data.categoryId;

      try {
        await updateCategoryMutation.mutateAsync({
          transactionIds: transactionIdsToUpdate,
          newCategoryId,
          merchantName,
          oldCategoryId,
        });

        onClose();
      } catch (error) {
        navigation.navigate("ViewTransactions.SingleTransactionDetailedScreen", {
          data: data,
          cardId,
          createDisputeUserId,
          mutationStatus: "error",
        });
      }
    }
  };

  const handleCheckboxChange = (transactionId: string) => (value: boolean) => {
    setSelectedTransactions(prev => ({ ...prev, [transactionId]: value }));
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
    height: "90%",
  }));

  const checkBoxStackStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing["12p"],
    paddingBottom: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const titleStackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["12p"],
    marginTop: -theme.spacing["8p"],
  }));

  const checkBoxTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["12p"],
  }));

  const buttonsContainer = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    marginTop: theme.spacing["32p"],
  }));

  const amountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["16p"],
    alignItems: "center",
    flexDirection: "row",
  }));

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => {
    return (
      <Stack key={transaction.TransactionId} direction="horizontal" style={checkBoxStackStyle}>
        <View style={checkBoxTextStyle}>
          <View style={titleStackStyle}>
            <Typography.Text size="caption2" weight="semiBold" color="neutralBase+30">
              {format(
                new Date(
                  transaction.BookingDateTime[0],
                  transaction.BookingDateTime[1] - 1,
                  transaction.BookingDateTime[2]
                ),
                "dd MMMM yyyy"
              )}
            </Typography.Text>
          </View>
          <Typography.Text size="callout" weight="regular" color="neutralBase+30">
            {transaction.StatementReference}
          </Typography.Text>
          <Typography.Text size="caption2" weight="regular" color="neutralBase">
            {transaction.Status}
          </Typography.Text>
        </View>
        <View style={styles.checkBoxStyle}>
          <View style={amountStyle}>
            <FormatTransactionAmount
              amount={parseFloat(transaction.Amount.Amount)}
              isPlusSignIncluded={false}
              color="neutralBase+30"
              isCurrencyIncluded={false}
              integerSize="callout"
              decimalSize="callout"
            />
            <Typography.Text size="callout" weight="regular" color="neutralBase+30">
              SAR
            </Typography.Text>
          </View>
          <View style={checkBoxContainerStyle}>
            <CheckboxInput
              onChange={handleCheckboxChange(transaction.TransactionId)}
              value={selectedTransactions[transaction.TransactionId] || false}
            />
          </View>
        </View>
      </Stack>
    );
  };

  const renderMainScreen = () => {
    return (
      <>
        <View>
          <Typography.Text color="neutralBase+30" size="title2" weight="medium">
            {t("ViewTransactions.SingleTransactionDetailedScreen.similarTransactions")}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" size="caption1" weight="regular">
            {similarTransactions && similarTransactions.length > 0
              ? t("ViewTransactions.SingleTransactionDetailedScreen.changeCategory", {
                  firstCategory: `“${similarTransactions[0].SupplementaryData.CategoryName}”`,
                  secondCategory: `“${data.categoryName}”`,
                })
              : null}
          </Typography.Text>

          <Stack direction="horizontal" style={checkBoxStackStyle}>
            <View style={checkBoxTextStyle}>
              <Typography.Text size="callout" weight="semiBold" color="neutralBase+10">
                {t("ViewTransactions.SingleTransactionDetailedScreen.selectAll")}
              </Typography.Text>
            </View>
            <View style={checkBoxContainerStyle}>
              {/* This component to handle select all  */}
              <CheckboxInput onChange={handleSelectAllChange} value={selectAll} />
            </View>
          </Stack>
          <FlatList
            data={similarTransactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.TransactionId}
          />
          <View style={buttonsContainer}>
            <Button disabled={isSubmitButtonDisabled()} onPress={handleOnSubmit}>
              {t("ViewTransactions.SingleTransactionDetailedScreen.changeCategories")}
            </Button>

            <Button
              disabled={isSubmitButtonDisabled()}
              variant="tertiary"
              onPress={() => {
                setSelectAll(false);
                setSelectedTransactions({});
              }}>
              {t("ViewTransactions.SingleTransactionDetailedScreen.clearAll")}
            </Button>
          </View>
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} style={modalStyle} onClose={onClose}>
      {renderMainScreen()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  checkBoxStyle: {
    alignItems: "center",
    flexDirection: "row",
  },
});
