import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatCurrency } from "@/utils";

import TransferCompleteIllustration from "../assets/TransferCompleteIllustration";

export default function ConfirmationScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { internalTransferEntryPoint, recipient, transferAmount, transferType } = useInternalTransferContext();
  const { height } = useWindowDimensions();

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

  const illustrationStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    aspectRatio: 1,
    height: height < 700 ? 200 : 305,
    marginBottom: theme.spacing["24p"],
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const messageStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: "auto",
    paddingTop: theme.spacing["32p"],
  }));

  const createTitleMessage = () => {
    if (recipient.type === "new") {
      if (
        transferType === TransferType.CroatiaToArbTransferAction ||
        transferType === TransferType.SarieTransferAction
      ) {
        return {
          title: t("InternalTransfers.ConfirmationScreen.title.payment"),
          message: t("InternalTransfers.ConfirmationScreen.message.beneficiaryAddedAndPending"),
        };
      }

      return {
        title: t("InternalTransfers.ConfirmationScreen.title.transfer"),
        message: t("InternalTransfers.ConfirmationScreen.message.beneficiaryAdded"),
      };
    } else if (recipient.type === "inactive") {
      if (
        transferType === TransferType.CroatiaToArbTransferAction ||
        transferType === TransferType.SarieTransferAction
      ) {
        return {
          title: t("InternalTransfers.ConfirmationScreen.title.payment"),
          message: t("InternalTransfers.ConfirmationScreen.message.transactionPending"),
        };
      }

      return {
        title: t("InternalTransfers.ConfirmationScreen.title.transfer"),
        message: t("InternalTransfers.ConfirmationScreen.message.beneficiaryAdded"),
      };
    } else {
      if (
        transferType === TransferType.CroatiaToArbTransferAction ||
        transferType === TransferType.SarieTransferAction
      ) {
        return {
          title: t("InternalTransfers.ConfirmationScreen.title.payment"),
          message: t("InternalTransfers.ConfirmationScreen.message.transactionPending"),
        };
      }

      return {
        title: t("InternalTransfers.ConfirmationScreen.title.transfer"),
        message: t("InternalTransfers.ConfirmationScreen.message.transferComplete"),
      };
    }
  };

  const { title, message } = createTitleMessage();

  return (
    <Page backgroundColor="primaryBase">
      <StatusBar barStyle="light-content" />
      <ContentContainer isScrollView alwaysBounceVertical={false}>
        <View style={illustrationStyle}>
          {/* TODO: Add a conditional for another illustration when Payment send is displayed */}
          <TransferCompleteIllustration />
        </View>
        <Typography.Text size="xlarge" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
          {title}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase-60" align="center" style={messageStyle}>
          {message}
        </Typography.Text>
        <List variant="dark" isBordered>
          {recipient.accountName !== undefined ? (
            <List.Item.Table
              caption={t("InternalTransfers.ConfirmationScreen.transferredTo")}
              label={recipient.accountName}
              end={
                <Stack direction="vertical">
                  <Typography.Text color="neutralBase-20" size="footnote">
                    {t("InternalTransfers.ConfirmationScreen.amount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-40">{formatCurrency(transferAmount ?? 0)} SAR</Typography.Text>
                </Stack>
              }
            />
          ) : (
            <List.Item.Table
              caption={t("InternalTransfers.ConfirmationScreen.amount")}
              label={`${formatCurrency(transferAmount ?? 0)} SAR`}
            />
          )}
        </List>

        <Stack align="stretch" direction="vertical" gap="8p" style={buttonContainerStyle}>
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
