import { RouteProp, useRoute } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NativeShareIcon } from "@/assets/icons";
import { TransferSuccessIcon } from "@/assets/icons/TransferSuccessIcon";
import Button from "@/components/Button";
import List from "@/components/List";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

type LocalTransfersStackParams = {
  screen: "InternalTransfers.InternalTransfersStack";
  transferAmount: number;
  beneficiaryName: string;
  clientTimestamp: unknown;
  referenceNumber?: string;
};

type LocalTransfersRouteParams = {
  InternalTransfers: LocalTransfersStackParams;
};

export default function LocalTransferSuccessScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<LocalTransfersRouteParams>>();

  const singleTransferProp = route?.params;
  const timestamp = singleTransferProp?.clientTimestamp as string;
  const parsedDate = parseISO(timestamp);
  const formattedDate = format(parsedDate, "EEE d MMMM, HH:mm");

  const transactionId = singleTransferProp?.referenceNumber;

  const handleOnDonePress = () => {
    navigation.navigate("Transfers.TrasnfersLandingScreen");
  };

  const handleOnViewTransactionsPress = () => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.ViewTransactionScreen",
    });
  };

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const shareIconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: 10,
    marginBottom: theme.spacing["24p"],
    alignSelf: "flex-end",
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const messageStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Page backgroundColor="primaryBase">
        <ScrollView contentContainerStyle={contentStyle}>
          <View style={styles.container}>
            <View style={shareIconStyle}>
              <NativeShareIcon />
            </View>
            <View style={iconStyle}>
              <TransferSuccessIcon color={iconColor} />
            </View>
            <Typography.Text size="xlarge" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
              {t("InternalTransfers.QuickTransferSuccessScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" color="neutralBase-60" align="center" style={messageStyle}>
              {t("InternalTransfers.QuickTransferSuccessScreen.message")}
            </Typography.Text>
          </View>
          <List testID="InternalTransfers.QuickTransferSuccessScreen:TransferList" isBordered variant="dark">
            <List.Item.Table
              itemListDirection="horizontal"
              caption={t("InternalTransfers.QuickTransferSuccessScreen.transferredTo")}
              label={singleTransferProp ? singleTransferProp?.beneficiaryName : ""}
            />
            <List.Item.Table
              itemListDirection="horizontal"
              caption={t("InternalTransfers.QuickTransferSuccessScreen.amount")}
              label={formatCurrency(
                singleTransferProp ? singleTransferProp?.transferAmount : 0,
                t("InternalTransfers.QuickTransferSuccessScreen.currency")
              )}
            />
            <List.Item.Table
              itemListDirection="horizontal"
              caption={t("InternalTransfers.QuickTransferSuccessScreen.dateAndTime")}
              label={formattedDate ?? ""}
            />
            <List.Item.Table
              itemListDirection="horizontal"
              caption={t("InternalTransfers.QuickTransferSuccessScreen.reference")}
              label={transactionId ?? ""}
            />
          </List>
          <Stack align="stretch" direction="vertical" gap="8p" style={buttonContainerStyle}>
            <Button
              color="dark"
              variant="primary"
              testID="InternalTransfers.QuickTransferSuccessScreen:DoneTransactionButton"
              onPress={handleOnDonePress}>
              {t("InternalTransfers.QuickTransferSuccessScreen.buttons.done")}
            </Button>
            <Button
              color="dark"
              variant="tertiary"
              testID="InternalTransfers.QuickTransferSuccessScreen:ViewTransactionButton"
              onPress={handleOnViewTransactionsPress}>
              {t("InternalTransfers.QuickTransferSuccessScreen.buttons.viewTransaction")}
            </Button>
          </Stack>
        </ScrollView>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
