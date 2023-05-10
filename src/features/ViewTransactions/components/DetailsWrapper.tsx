import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

import { PHYSICAL_CARD_TYPE } from "@/constants";
import useNavigation from "@/navigation/use-navigation";

import { TransactionDetailed } from "../types";
import DetailedBody from "./DetailedBody";
import DetailedButton from "./DetailedButton";
import DetailedHeader from "./DetailedHeader";
import DetailedRow from "./DetailedRow";

interface HOCprops {
  data: TransactionDetailed;
  cardId: string;
  createDisputeUserId: string;
  openModel: (arg: boolean) => void;
}

function DetailsWrapper({ data, cardId, createDisputeUserId, openModel }: HOCprops) {
  return (
    <>
      {data.cardType === PHYSICAL_CARD_TYPE && data.status === "pending" ? (
        <PendingTransaction data={data} cardId={cardId} createDisputeUserId={createDisputeUserId} />
      ) : data.cardType === PHYSICAL_CARD_TYPE || data.cardType === "0" ? (
        <DebitCardAndOneTimeCard
          openModel={openModel}
          data={data}
          cardId={cardId}
          createDisputeUserId={createDisputeUserId}
        />
      ) : null}
    </>
  );
}

function PendingTransaction({
  data,
  cardId,
  createDisputeUserId,
}: {
  data: TransactionDetailed;
  cardId: string;
  createDisputeUserId: string;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnReportTransactionPress = () => {
    navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
      screen: "PaymentDisputes.PaymentDisputeScreen",
      params: {
        cardId,
        createDisputeUserId,
        transactionDetails: data,
      },
    });
  };

  return (
    <>
      <DetailedHeader data={data} />
      <DetailedBody>
        <DetailedRow name="Status" value={data.status} />
        {data.location ? <DetailedRow name="Location" value={data.location} /> : <></>}

        <View style={styles.detailedButton}>
          <DetailedButton
            label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
            text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
            onPress={handleOnReportTransactionPress}
          />
        </View>
      </DetailedBody>
    </>
  );
}

function DebitCardAndOneTimeCard({
  data,
  cardId,
  createDisputeUserId,
  openModel,
}: {
  data: TransactionDetailed;
  cardId: string;
  createDisputeUserId: string;
  openModel: (arg: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnReportTransactionPress = () => {
    navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
      screen: "PaymentDisputes.PaymentDisputeScreen",
      params: {
        cardId,
        createDisputeUserId,
        transactionDetails: data,
      },
    });
  };
  return (
    <>
      <DetailedHeader data={data} />
      <DetailedBody>
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
          <DetailedButton
            label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
            text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
            onPress={handleOnReportTransactionPress}
          />
          {data.cardType === "0" ? (
            <DetailedButton
              label={t("ViewTransactions.SingleTransactionDetailedScreen.downloadDetails")}
              text={t("ViewTransactions.SingleTransactionDetailedScreen.saveTransaction")}
              onPress={() => {
                Alert.alert("Save transaction is pressed");
              }}
            />
          ) : null}
        </View>
      </DetailedBody>
    </>
  );
}

const styles = StyleSheet.create({
  detailedButton: {
    marginTop: 40,
  },
});

export default DetailsWrapper;
