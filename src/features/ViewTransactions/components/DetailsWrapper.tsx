import { format } from "date-fns";
import { toString } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardButton from "@/components/CardButton";
import ContentContainer from "@/components/ContentContainer";
import DetailedRow from "@/components/DetailedRow";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { PHYSICAL_CARD_TYPE } from "@/constants";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { TransactionDetailed } from "../types";
import DetailedHeader from "./DetailedHeader";
import ExcludeFromSummary from "./ExcludeFromSummary";

interface DetailsWrapperProps {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
  cardId: string;
  createDisputeUserId: string;
}

function DetailsWrapper({ data, openModel, onReportTransaction }: DetailsWrapperProps) {
  return (
    <>
      {data.cardType === PHYSICAL_CARD_TYPE && data.status === "pending" ? (
        <PendingTransaction data={data} onReportTransaction={onReportTransaction} />
      ) : data.cardType === PHYSICAL_CARD_TYPE || data.cardType === "0" ? (
        <DebitCardAndOneTimeCard data={data} openModel={openModel} onReportTransaction={onReportTransaction} />
      ) : null}
    </>
  );
}

function PendingTransaction({
  data,
  onReportTransaction,
}: {
  data: TransactionDetailed;
  onReportTransaction: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <DetailedHeader data={data} />
      <ContentContainer>
        <DetailedRow name="Status" value={data.status} />
        {data.location ? <DetailedRow name="Location" value={data.location} /> : <></>}

        <View style={styles.detailedButton}>
          <CardButton
            label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
            text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
            onPress={onReportTransaction}
          />
        </View>
      </ContentContainer>
    </>
  );
}

function DebitCardAndOneTimeCard({
  data,
  openModel,
  onReportTransaction,
  createDisputeUserId,
  cardId,
}: {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
  createDisputeUserId: string;
  cardId: string;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressCategoriesList = () => {
    navigation.navigate("ViewTransactions.CategoriesListScreen", {
      categoryId: toString(data.categoryId),
      data: data,
      cardId: cardId,
      createDisputeUserId: createDisputeUserId,
    });
  };

  const handleOnPressTags = () => {
    navigation.navigate("TopSpending.TopSpendingStack", {
      screen: "TopSpending.SelectTagScreen",
    });
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  // Extracting date and time elements from the transactionDate array
  const dateFromData = new Date(
    data.transactionDate[0], // Year
    data.transactionDate[1] - 1, // Month (adjusted for JavaScript's 0-indexed months)
    ...data.transactionDate.slice(2, 6) // Day, Hour, Minute, and Second
  );

  // Formatting our date object into a readable string "Mon 4 Jul, 14:30"
  // "EEE" -> Day of the week in short form
  // "d" -> Day of the month
  // "MMM" -> Month in short form
  // "HH:mm" -> Hours and minutes
  const formattedDate = format(dateFromData, "EEE d MMM, HH:mm");

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const header = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  return (
    <>
      <SafeAreaView edges={["top"]} style={header}>
        <NavHeader onBackPress={handleOnBackPress} title={formattedDate} />
        <View style={headerStyle}>
          <View>
            <Typography.Text color="neutralBase+30" size="title3" weight="bold">
              {data.title}
            </Typography.Text>
            <Typography.Text color="primaryBase-40" weight="regular" size="caption2">
              {data.subTitle}
            </Typography.Text>
          </View>

          <View style={styles.sarStyle}>
            <FormatTransactionAmount
              amount={parseFloat(data.amount)}
              isPlusSignIncluded={false}
              integerSize="title2"
              decimalSize="body"
              color="neutralBase+30"
              isCurrencyIncluded={true}
              currencyColor="primaryBase-40"
            />
          </View>
        </View>
      </SafeAreaView>

      <ContentContainer style={contentStyle}>
        <DetailedRow
          openModel={openModel}
          name={t("ViewTransactions.SingleTransactionDetailedScreen.status")}
          value={
            data.status.trim() === "Booked"
              ? t("ViewTransactions.SingleTransactionDetailedScreen.completed")
              : data.status
          }
          roundup={false}
        />
        {data.subTitle !== "Incoming Payment" ? (
          <DetailedRow
            name={t("ViewTransactions.SingleTransactionDetailedScreen.roundUpAmount")}
            openModel={openModel}
            value={parseFloat(data.roundUpsAmount).toFixed(0) + " " + data.currency}
            roundup={true}
          />
        ) : null}
        {data.cardType === "0" ? (
          <DetailedRow
            name={t("ViewTransactions.SingleTransactionDetailedScreen.roundUpAmount")}
            openModel={openModel}
            value={parseFloat(data.roundUpsAmount).toFixed(0) + " " + data.currency}
            roundup={true}
          />
        ) : null}
        {data.categoryName ? (
          <Pressable onPress={data.categoryId !== "10" ? handleOnPressCategoriesList : undefined}>
            <DetailedRow
              name={t("ViewTransactions.SingleTransactionDetailedScreen.category")}
              value={data.categoryName}
              showIcon={data.categoryId !== "10" ? true : false}
            />
          </Pressable>
        ) : null}
        {/* TODO: later will check from tag property as of now it's not there */}
        {data.categoryName ? (
          <Pressable onPress={handleOnPressTags}>
            <DetailedRow
              name={t("ViewTransactions.SingleTransactionDetailedScreen.tags")}
              //TODO: Later will be replaced with tags data in the next build cycle
              value="Shopping, Food, +1 more"
              showIcon
            />
          </Pressable>
        ) : null}
        {data?.location ? (
          <DetailedRow
            openModel={openModel}
            name={t("ViewTransactions.SingleTransactionDetailedScreen.location")}
            value={data.location}
            roundup={false}
          />
        ) : null}
        <ExcludeFromSummary transactionId={data.transactionId} />
        <View style={styles.detailedButton}>
          <CardButton
            label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
            text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
            onPress={onReportTransaction}
          />
          {data.cardType === "0" ? (
            <CardButton
              label={t("ViewTransactions.SingleTransactionDetailedScreen.downloadDetails")}
              text={t("ViewTransactions.SingleTransactionDetailedScreen.saveTransaction")}
              onPress={() => {
                Alert.alert("Save transaction is pressed");
              }}
            />
          ) : null}
        </View>
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  detailedButton: {
    marginTop: 40,
  },
  sarStyle: {
    alignItems: "baseline",
    flexDirection: "row",
  },
});

export default DetailsWrapper;
