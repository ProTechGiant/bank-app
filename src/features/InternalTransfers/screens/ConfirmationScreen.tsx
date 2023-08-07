import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { CheckCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { TransferType } from "../types";

export default function ConfirmationScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { internalTransferEntryPoint, recipient, transferAmount, transferType } = useInternalTransferContext();

  const handleOnDonePress = () => {
    if (internalTransferEntryPoint === "payment-hub") {
      navigation.navigate("InternalTransfers.PaymentsHubScreen");
    } else {
      navigation.navigate("Home.HomeStack", { screen: "Home.DashboardScreen" });
    }
  };

  const handleOnViewTransactionsPress = () => {
    if (transferAmount === undefined) {
      return;
    }

    //TODO: remove this hardcoded transaction data when transaction details are fetched from transactionDetail API in SingleTransactionDetailedScreen
    const obj = {
      amount: transferAmount ?? "",
      cardType: "1",
      categoryId: "2",
      categoryName: "Food and Drinks",
      currency: "SAR",
      location: "1",
      roundUpsAmount: "0.0",
      status: "Booked ",
      subTitle: "Online Transaction",
      title: "Nuba",
      transactionDate: [2023, 6, 25, 2, 31, 31, 202971000],
    };

    navigation.navigate("ViewTransactions.ViewTransactionsStack", {
      screen: "ViewTransactions.SingleTransactionDetailedScreen",
      params: {
        data: obj,
        cardId: "12",
        createDisputeUserId: "12",
      },
    });
  };

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: 80,
    marginBottom: theme.spacing["24p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const messageStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="primaryBase">
      <StatusBar barStyle="light-content" />
      <ContentContainer isScrollView style={styles.flex}>
        <View style={styles.container}>
          <View style={iconStyle}>
            <CheckCircleIcon height={66} width={66} color={iconColor} />
          </View>
          <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
            {recipient.type === "new"
              ? transferType === TransferType.CroatiaToArbTransferAction
                ? t("InternalTransfers.ConfirmationScreen.title.newARB")
                : transferType === TransferType.SarieTransferAction
                ? t("InternalTransfers.ConfirmationScreen.title.newsarie")
                : t("InternalTransfers.ConfirmationScreen.title.new")
              : recipient.type === "inactive"
              ? transferType === TransferType.CroatiaToArbTransferAction
                ? t("InternalTransfers.ConfirmationScreen.title.inactiveARB")
                : transferType === TransferType.SarieTransferAction
                ? t("InternalTransfers.ConfirmationScreen.title.inactivesarie")
                : t("InternalTransfers.ConfirmationScreen.title.inactive")
              : transferType === TransferType.CroatiaToArbTransferAction
              ? t("InternalTransfers.ConfirmationScreen.title.activeARB")
              : transferType === TransferType.SarieTransferAction
              ? t("InternalTransfers.ConfirmationScreen.title.activesarie")
              : t("InternalTransfers.ConfirmationScreen.title.active")}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
            {transferType === TransferType.SarieTransferAction
              ? t("InternalTransfers.ConfirmationScreen.sarieTransferMessage")
              : t("InternalTransfers.ConfirmationScreen.message")}
          </Typography.Text>
        </View>
        <TableListCardGroup background="dark">
          {recipient.accountName !== undefined ? (
            <TableListCard
              isGrouped
              caption={t("InternalTransfers.ConfirmationScreen.transferredTo")}
              label={recipient.accountName}
              background="dark"
              labelSize="title2"
              labelWeight="regular"
            />
          ) : null}
          <TableListCard
            isGrouped
            caption={t("InternalTransfers.ConfirmationScreen.amount")}
            label={`${formatCurrency(transferAmount ?? 0)} SAR`}
            background="dark"
            labelSize="title2"
            labelWeight="regular"
          />
        </TableListCardGroup>
        <Stack align="stretch" direction="vertical" gap="8p" style={styles.buttonContainer}>
          <Button color="dark" variant="primary" onPress={handleOnDonePress}>
            {t("InternalTransfers.ConfirmationScreen.buttons.done")}
          </Button>
          <Button color="light" variant="primary" onPress={handleOnViewTransactionsPress}>
            {t("InternalTransfers.ConfirmationScreen.buttons.viewTransaction")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  container: {
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
});
