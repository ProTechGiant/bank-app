import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

import CardButton from "@/components/CardButton";
import ContentContainer from "@/components/ContentContainer";
import DetailedRow from "@/components/DetailedRow";
import { PHYSICAL_CARD_TYPE } from "@/constants";

import { TransactionDetailed } from "../types";
import DetailedHeader from "./DetailedHeader";

interface HOCprops {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
}

function DetailsWrapper({ data, openModel, onReportTransaction }: HOCprops) {
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
}: {
  data: TransactionDetailed;
  openModel: (arg: boolean) => void;
  onReportTransaction: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <DetailedHeader data={data} />
      <ContentContainer>
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
          <DetailedRow
            name={t("ViewTransactions.SingleTransactionDetailedScreen.category")}
            value={data.categoryName}
          />
        ) : (
          <></>
        )}
        {data.location ? (
          <DetailedRow
            openModel={openModel}
            name={t("ViewTransactions.SingleTransactionDetailedScreen.location")}
            value={data.location}
            roundup={false}
          />
        ) : null}
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
});

export default DetailsWrapper;
