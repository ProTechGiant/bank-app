import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CheckCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { TransferStatus, TransferType } from "../types";

export default function ConfirmationScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { internalTransferEntryPoint, recipient, transferAmount, transferType, transferStatus } =
    useInternalTransferContext();

  const handleOnDonePress = () => {
    internalTransferEntryPoint === "payment-hub"
      ? navigation.navigate("InternalTransfers.PaymentsHubScreen")
      : navigation.navigate("Home.HomeStack", { screen: "Home.DashboardScreen" });
  };

  const handleOnViewTransactionsPress = () => {
    //TODO: navigate to transaction details
    handleOnDonePress();
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
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Page backgroundColor="primaryBase">
        <ContentContainer isScrollView style={styles.flex}>
          <View style={styles.container}>
            <View style={iconStyle}>
              <CheckCircleIcon height={66} width={66} color={iconColor} />
            </View>
            <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
              {transferType === TransferType.SarieTransferAction && transferStatus === TransferStatus.Pending
                ? t("InternalTransfers.ConfirmationScreen.title.pending")
                : recipient.type === "new"
                ? transferType === TransferType.CroatiaToArbTransferAction
                  ? t("InternalTransfers.ConfirmationScreen.title.newARB")
                  : t("InternalTransfers.ConfirmationScreen.title.new")
                : recipient.type === "inactive"
                ? transferType === TransferType.CroatiaToArbTransferAction
                  ? t("InternalTransfers.ConfirmationScreen.title.inactiveARB")
                  : t("InternalTransfers.ConfirmationScreen.title.inactive")
                : transferType === TransferType.CroatiaToArbTransferAction
                ? t("InternalTransfers.ConfirmationScreen.title.activeARB")
                : t("InternalTransfers.ConfirmationScreen.title.active")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
              {transferType === TransferType.SarieTransferAction && transferStatus === TransferStatus.Pending
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
    </SafeAreaProvider>
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
