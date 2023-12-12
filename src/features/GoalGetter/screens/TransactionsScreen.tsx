import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import DefaultContent from "@/components/DefaultContent";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import noTransactionImage from "../assets/no-transactions-image.png";
import TransactionCard from "../components/TransactionCard";
import { useGoldTransaction } from "../hooks/query-hooks";
import { TransactionType } from "../types";

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    params: { goalId },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoalGetter.TransactionsScreen">>();

  const { data: transactionsList, isError, isLoading, refetch } = useGoldTransaction(goalId, 10); // TODO page size will confirm it with BA team t
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isError) setIsErrorModalVisible(isError);
  }, [isError]);

  const transactionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["8p"],
  }));

  const defaultContentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const openDetailsHandler = (transaction: TransactionType) => {
    navigation.navigate("GoalGetter.TransactionsDetailsModal", {
      transaction,
    });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.TransactionsScreen.title")}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <Stack direction="horizontal" align="center" justify="space-between" style={transactionsContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
          {t("GoalGetter.TransactionsScreen.subTitle")}
        </Typography.Text>
      </Stack>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ContentContainer isScrollView>
          {transactionsList && transactionsList.length ? (
            transactionsList.map(item => {
              return (
                <TransactionCard
                  transaction={item}
                  key={item.TransactionId}
                  openDetailsHandler={() => openDetailsHandler(item)}
                />
              );
            })
          ) : (
            <Stack direction="vertical" justify="center" align="center" style={defaultContentStyle}>
              <DefaultContent
                title={t("GoalGetter.TransactionsScreen.noTransactionTitle")}
                subtitle={t("GoalGetter.TransactionsScreen.noTransactionSubtitle")}
                image={noTransactionImage}
              />
            </Stack>
          )}
        </ContentContainer>
      )}
      <LoadingErrorNotification
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        onRefresh={refetch}
      />
    </Page>
  );
}
