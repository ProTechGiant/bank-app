import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, ViewStyle } from "react-native";

import {
  LocalTransferIcon,
  SadadBillPaymentIcon,
  SearchIcon,
  TransferHorizontalIcon,
  WalletIcon,
} from "@/assets/icons";
import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatCurrency } from "@/utils";

import { PaymentOption } from "../components";

export default function PaymentsHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setInternalTransferEntryPoint, clearContext, setTransferType } = useInternalTransferContext();

  const account = useCurrentAccount();

  const [isSelectTransferTypeVisible, setIsSelectTransferTypeVisible] = useState(false);
  const [isSelectInternalTransferTypeVisible, setIsSelectInternalTransferTypeVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnInternalTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(true);
    clearContext();
    setInternalTransferEntryPoint("payment-hub");
  };

  const handleOnSadadBillPress = () => {
    navigation.navigate("SadadBillPayments.SadadBillPaymentStack", {
      screen: "SadadBillPayments.BillPaymentHomeScreen",
    });
  };

  const handleOnAliasManagmentPress = () => {
    navigation.navigate("ProxyAlias.ProxyAliasStack", {
      screen: "ProxyAlias.AliasManagementScreen",
    });
  };

  const handleOnCroatiaTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(false);
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnAlrajhiTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const searchContainer = useThemeStyles<ViewStyle>(theme => ({
    // TODO: Temp background color as it's not found in core theme and design is not finished
    backgroundColor: theme.palette["neutralBase-60-60%"],
    padding: theme.spacing["8p"],
    borderRadius: 40,
  }));

  const searchIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
        <NavHeader variant="angled" withBackButton={false} testID="InternalTransfers.PaymentsHubScreen:NavHeader">
          <NavHeader.BoldTitle>{t("InternalTransfers.PaymentsHubScreen.title")}</NavHeader.BoldTitle>
          <Stack direction="horizontal" gap="12p" align="flex-end" justify="space-between">
            {account.data !== undefined ? (
              <Stack gap="8p" direction="vertical" style={styles.expandText}>
                <Typography.Text
                  color="neutralBase+30"
                  size="title3"
                  weight="medium"
                  testID="InternalTransfers.PaymentsHubScreen:AccountName">
                  {account.data.name}
                </Typography.Text>
                <Typography.Text
                  color="neutralBase+10"
                  size="footnote"
                  testID="InternalTransfers.PaymentsHubScreen:AccountBalanceAvailable">
                  {t("InternalTransfers.PaymentsHubScreen.balanceAvailable", {
                    balance: formatCurrency(account.data.balance, "SAR"),
                  })}
                </Typography.Text>
              </Stack>
            ) : null}
            {/* TODO: not working on search functionality yet */}
            <Pressable style={searchContainer} testID="InternalTransfers.PaymentsHubScreen:SearchButton">
              <SearchIcon color={searchIconColor} />
            </Pressable>
          </Stack>
        </NavHeader>
        <ScrollView contentContainerStyle={contentStyle}>
          <Stack direction="vertical" gap="32p" align="stretch">
            <PaymentOption
              onPress={() => setIsSelectTransferTypeVisible(true)}
              icon={<LocalTransferIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.localTransfer.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.localTransfer.helperText")}
              testID="InternalTransfers.PaymentsHubScreen:LocalTransferButton"
            />
            <PaymentOption
              onPress={handleOnInternalTransferPress}
              icon={<TransferHorizontalIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.helperText")}
              testID="InternalTransfers.PaymentsHubScreen:InternalTransferButton"
            />
            <PaymentOption
              onPress={handleOnSadadBillPress}
              icon={<SadadBillPaymentIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.sadadbillpayment.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.sadadbillpayment.helperText")}
              testID="InternalTransfers.PaymentsHubScreen:SadadBillButton"
            />
            <PaymentOption
              onPress={handleOnAliasManagmentPress}
              icon={<WalletIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.aliasManagment.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.aliasManagment.helperText")}
              testID="InternalTransfers.PaymentsHubScreen:AliasManagementButton"
            />
          </Stack>
        </ScrollView>
        <SelectTransferTypeModal
          isVisible={isSelectTransferTypeVisible}
          onClose={() => setIsSelectTransferTypeVisible(false)}
          setIsErrorModalVisible={setIsErrorModalVisible}
          entryPoint="payment-hub"
          testID="InternalTransfers.PaymentsHubScreen:SelectTransferTypeModal"
        />
        <InternalTransferTypeModal
          isVisible={isSelectInternalTransferTypeVisible}
          onClose={() => setIsSelectInternalTransferTypeVisible(false)}
          onCroatiaPress={handleOnCroatiaTransferPress}
          onAlrajhiPress={handleOnAlrajhiTransferPress}
          testID="InternalTransfers.PaymentsHubScreen:InternalTransferTypeModal"
        />
        <NotificationModal
          variant="error"
          title={t("errors.generic.title")}
          message={t("errors.generic.message")}
          isVisible={isErrorModalVisible}
          onClose={() => setIsErrorModalVisible(false)}
        />
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
