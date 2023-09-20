import { format } from "date-fns";
import { toString } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, SectionList, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackgroundBottom from "@/assets/BackgroundBottom";
import { DiamondIcon } from "@/assets/icons";
import CardButton from "@/components/CardButton";
import ContentContainer from "@/components/ContentContainer";
import DetailedRow from "@/components/DetailedRow";
import Divider from "@/components/Divider";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import IconGenerator from "@/components/IconGenerator";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { PHYSICAL_CARD_TYPE } from "@/constants";
import useTransactions from "@/hooks/use-not-pending-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { userType } from "../mocks";
import { SingleTagType, TransactionDetailed } from "../types";
import DetailedHeader from "./DetailedHeader";
import ExcludeFromSummary from "./ExcludeFromSummary";

interface DetailsWrapperProps {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
  cardId: string;
  createDisputeUserId: string;
  transactionTags: Array<SingleTagType>;
}

// TODO separating the components next BC

function DetailsWrapper({ data, openModel, onReportTransaction, transactionTags }: DetailsWrapperProps) {
  return (
    <>
      {data.cardType === PHYSICAL_CARD_TYPE && data.status === "pending" ? (
        <PendingTransaction data={data} onReportTransaction={onReportTransaction} />
      ) : data.cardType === PHYSICAL_CARD_TYPE || data.cardType === "0" ? (
        <DebitCardAndOneTimeCard
          data={data}
          openModel={openModel}
          onReportTransaction={onReportTransaction}
          transactionTags={transactionTags}
        />
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

        <CardButton
          label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
          text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
          onPress={onReportTransaction}
        />
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
  transactionTags,
}: {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
  createDisputeUserId: string;
  cardId: string;
  transactionTags: Array<SingleTagType>;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const toDate = new Date(data.transactionDate[0], data.transactionDate[1] - 1, data.transactionDate[2]);

  // subtract 6 months from the 'toDate' to create the 'fromDate'
  const fromDate = new Date(toDate.getFullYear(), toDate.getMonth() - 6, toDate.getDate());

  const { notPendingTransactions } = useTransactions(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    format(fromDate, "yyyy-MM-dd"),
    format(toDate, "yyyy-MM-dd"),
    data.title
  );

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // TODO backend currently doesn't filter by hour, min, sec,
  const comparisonDate = new Date(
    data.transactionDate[0],
    data.transactionDate[1] - 1,
    data.transactionDate[2],
    data.transactionDate[3],
    data.transactionDate[4],
    data.transactionDate[5]
  );

  const filteredTransactions =
    notPendingTransactions.data?.Transaction?.filter(transaction => {
      const transactionDate = new Date(
        transaction.BookingDateTime[0],
        transaction.BookingDateTime[1] - 1,
        transaction.BookingDateTime[2],
        transaction.BookingDateTime[3],
        transaction.BookingDateTime[4],
        transaction.BookingDateTime[5]
      );
      return transactionDate < comparisonDate;
    }) ?? [];

  const limitedData = showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 2);

  const handleOnPressCategoriesList = () => {
    navigation.navigate("ViewTransactions.CategoriesListScreen", {
      categoryId: toString(data.categoryId),
      data: data,
      cardId: cardId,
      createDisputeUserId: createDisputeUserId,
    });
  };

  const handleOnPressTags = () => {
    navigation.navigate("ViewTransactions.SelectTagScreen", {
      transactionTags: transactionTags,
      transactionId: data.transactionId,
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
    backgroundColor: theme.palette["supportBase-15"],
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
  }));

  const tagsValue =
    transactionTags?.length > 0
      ? transactionTags?.length > 1
        ? `${transactionTags[0].TagName} +${transactionTags.length - 1} more`
        : `${transactionTags[0].TagName}`
      : "";
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingTop: theme.spacing["32p"],
    flex: 1,
  }));

  const contentSpacingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const backgroundBottomStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: -theme.spacing["24p"] + 1, // Small gap forms on iphone SE, 1 pixel added to remove this.
  }));

  const backgroundAngledColor = useThemeStyles(theme => theme.palette["supportBase-15"]);

  const transactionsListStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const tagsMarginStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
  }));

  const iconDiamondColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <>
      <SafeAreaView edges={["top"]} style={headerContainerStyle}>
        <NavHeader variant="background" onBackPress={handleOnBackPress} title={formattedDate} />
        <View style={headerStyle}>
          <View>
            <Typography.Text color="neutralBase+30" size="title3" weight="bold">
              {data.title}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" weight="regular" size="caption2">
              {data.subTitle}
            </Typography.Text>
          </View>

          <View style={styles.sarStyle}>
            <FormatTransactionAmount
              amount={parseFloat(data.amount)}
              isPlusSignIncluded={false}
              integerSize="title3"
              decimalSize="title3"
              color="neutralBase+30"
              isCurrencyIncluded={false}
              currencyColor="primaryBase-40"
            />
            <Typography.Text size="title3" weight="regular">
              {" "}
              {t("Currency.sar")}
            </Typography.Text>
          </View>
        </View>
        <View style={backgroundBottomStyle}>
          <BackgroundBottom color={backgroundAngledColor} />
        </View>
      </SafeAreaView>

      <View style={contentStyle}>
        <View style={contentSpacingStyle}>
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
          {userType === "standard" ? (
            <>
              <DetailedRow
                name={t("ViewTransactions.SingleTransactionDetailedScreen.tags")}
                value={t("ViewTransactions.SingleTransactionDetailedScreen.notSelected")}
                showIcon
              />
              <View style={styles.tagsText}>
                <DiamondIcon color={iconDiamondColor} />
                <Typography.Text style={tagsMarginStyle} size="footnote" weight="regular" color="neutralBase+30">
                  {t("ViewTransactions.SingleTransactionDetailedScreen.croatiaPlus")}
                </Typography.Text>
              </View>
            </>
          ) : (
            <Pressable onPress={handleOnPressTags}>
              <DetailedRow
                name={t("ViewTransactions.SingleTransactionDetailedScreen.tags")}
                value={tagsValue}
                showIcon
              />
            </Pressable>
          )}
          {data?.location ? (
            <DetailedRow
              openModel={openModel}
              name={t("ViewTransactions.SingleTransactionDetailedScreen.location")}
              value={data.location}
              roundup={false}
            />
          ) : null}
        </View>
        <Divider color="neutralBase-40" height={4} />

        <View style={contentSpacingStyle}>
          <ExcludeFromSummary transactionId={data.transactionId} isHidden={data.hiddenIndicator} />
        </View>

        <Divider color="neutralBase-40" height={4} />

        <View>
          <CardButton
            //* TODO remove static icon path once its ready from back end
            icon={
              <IconGenerator
                path="M7.86 2.5L8.26 4.5H13.5V10.5H10.14L9.74 8.5H2.5V2.5H7.86ZM9.5 0.5H0.5V17.5H2.5V10.5H8.1L8.5 12.5H15.5V2.5H9.9L9.5 0.5Z"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                color={iconColor}
              />
            }
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
        <Divider color="neutralBase-40" height={4} />

        {limitedData.length > 0 && data.categoryId !== "10" ? (
          <View style={[contentSpacingStyle, styles.transactionsContainer]}>
            <View style={transactionsListStyle}>
              <Typography.Text size="title3" weight="medium">
                {t("ViewTransactions.SingleTransactionDetailedScreen.pastTransactions")}
              </Typography.Text>

              <Pressable onPress={() => setShowAllTransactions(!showAllTransactions)}>
                <Typography.Text color="interactionBase" size="footnote" weight="medium">
                  {showAllTransactions
                    ? t("ViewTransactions.SingleTransactionDetailedScreen.showLess")
                    : t("ViewTransactions.SingleTransactionDetailedScreen.showAll")}
                </Typography.Text>
              </Pressable>
            </View>
            <SectionList
              sections={[{ data: limitedData }]}
              keyExtractor={(item, index) => item.TransactionId + index}
              renderItem={({ item }) => (
                <CardButton
                  //* TODO remove static icon path once its ready from back end
                  icon={
                    <IconGenerator
                      path="M7.86 2.5L8.26 4.5H13.5V10.5H10.14L9.74 8.5H2.5V2.5H7.86ZM9.5 0.5H0.5V17.5H2.5V10.5H8.1L8.5 12.5H15.5V2.5H9.9L9.5 0.5Z"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      color={iconColor}
                    />
                  }
                  label={item.MerchantDetails.MerchantName}
                  text={format(
                    new Date(item.BookingDateTime[0], item.BookingDateTime[1] - 1, item.BookingDateTime[2]),
                    "dd MMM yyyy"
                  )}
                  amount={item.Amount.Amount}
                  onPress={() => {
                    // TODO after api is ready
                    console.log("Trigered!!");
                  }}
                />
              )}
            />
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sarStyle: {
    alignItems: "baseline",
    flexDirection: "row",
  },
  tagsText: {
    flexDirection: "row",
    marginTop: -10,
  },
  transactionsContainer: {
    flex: 1,
  },
});

export default DetailsWrapper;
