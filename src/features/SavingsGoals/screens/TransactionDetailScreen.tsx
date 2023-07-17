import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import format from "date-fns/format";
import { enUS } from "date-fns/locale";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import CardButton from "@/components/CardButton";
import ContentContainer from "@/components/ContentContainer";
import DetailedRow from "@/components/DetailedRow";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { GoalHeader } from "../components";
import { useSavingsPot } from "../hooks/query-hooks";

export default function TransactionDetailScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.TransactionDetailScreen">>();
  const { data, PotId } = route.params ?? {};

  const { data: savingsPotData } = useSavingsPot(PotId);

  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  // Function to update the header title
  const updateHeaderTitle = (isoDate: number[]) => {
    const [year, month, day, hours, minutes] = isoDate;

    navigation.setOptions({
      title: format(new Date(year, month - 1, day, hours ?? 0, minutes ?? 0), "EEE d MMM',' HH:mm", {
        locale: enUS,
      }),
    });
  };

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

  useEffect(() => {
    if (isFocused) {
      updateHeaderTitle(data?.TransactionDate);
    }
  }, [isFocused]);

  return (
    <Page insets={["bottom", "left", "right"]}>
      <GoalHeader
        transactionName={data.TransactionName}
        goalName={savingsPotData?.GoalName}
        amount={data.TransactionAmount}
      />
      <ContentContainer>
        <DetailedRow
          name={t("ViewTransactions.SingleTransactionDetailedScreen.status")}
          value={t("ViewTransactions.SingleTransactionDetailedScreen.completed")}
        />
        {data.TransactionName === "Withdrawal" ? (
          <DetailedRow
            name={t("ViewTransactions.SingleTransactionDetailedScreen.paidTo")}
            value={t("ViewTransactions.SingleTransactionDetailedScreen.mainAccount")}
          />
        ) : data.TransactionName === "Round-up" ? (
          <DetailedRow name={t("ViewTransactions.SingleTransactionDetailedScreen.category")} value={data.Category} />
        ) : null}

        <View style={styles.detailedButton}>
          <CardButton
            label={t("ViewTransactions.SingleTransactionDetailedScreen.reportTransaction")}
            text={t("ViewTransactions.SingleTransactionDetailedScreen.somethingWrong")}
            onPress={handleOnReportTransactionPress}
          />
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  detailedButton: {
    marginTop: 40,
  },
});
