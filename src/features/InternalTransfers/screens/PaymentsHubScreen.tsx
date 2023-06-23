import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocalTransferIcon, SearchIcon, TransferHorizontalIcon } from "@/assets/icons";
import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { PaymentOption, SelectTransferTypeModal } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useQuickTransferAccounts } from "../hooks/query-hooks";
import { TransferTypeCode } from "../types";

export default function PaymentsHubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setInternalTransferEntryPoint, clearContext, setTransferType } = useInternalTransferContext();

  const account = useCurrentAccount();
  const isActivatedQuickTransfer = useQuickTransferAccounts();

  const [isSelectTransferTypeVisible, setIsSelectTransferTypeVisible] = useState(false);
  const [isSelectInternalTransferTypeVisible, setIsSelectInternalTransferTypeVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnInternalTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(true);
    setInternalTransferEntryPoint("payment-hub");
    clearContext();
  };

  const handleOnQuickTransferPress = () => {
    setIsSelectTransferTypeVisible(false);

    if (isActivatedQuickTransfer?.status === "error") {
      setIsErrorModalVisible(true);
    } else if (isActivatedQuickTransfer?.data?.CustomerTermsConditionsFlag === "0") {
      setTimeout(() => {
        navigation.navigate("InternalTransfers.TermsAndConditionsModal");
      }, 500);
    } else if (isActivatedQuickTransfer?.data?.CustomerTermsConditionsFlag === "1") {
      navigation.navigate("InternalTransfers.QuickTransferScreen");
    }
  };

  const handleOnCroatiaTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(false);
    setTransferType(TransferTypeCode.InternalTransferCroatia);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleOnAlrajhiTransferPress = () => {
    setIsSelectInternalTransferTypeVisible(false);
    setTransferType(TransferTypeCode.InternalTransferAlrajhi);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleStandardTransferPress = () => {
    setIsSelectTransferTypeVisible(false);
    setInternalTransferEntryPoint("payment-hub");
    navigation.navigate("InternalTransfers.StandardTransferScreen");
  };

  const headerBackground = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
  }));

  const headerContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    paddingTop: theme.spacing["32p"],
  }));

  const mockCardStyle = useThemeStyles<ViewStyle>(theme => ({
    // TODO: temporary card to be replace with small svg or mini card component
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: 1,
    height: 34,
    width: 55,
  }));

  const searchContainer = useThemeStyles<ViewStyle>(theme => ({
    // TODO: Temp background color as it's not found in core theme and design is not finished
    backgroundColor: "rgba(242, 242, 242, 0.2)",
    padding: theme.spacing["8p"],
    borderRadius: 40,
  }));

  const searchIconColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View style={headerBackground}>
          <SafeAreaView edges={["top", "left", "right"]}>
            <Stack direction="vertical" gap="32p" style={headerContainer}>
              <Typography.Text size="large" weight="bold" color="neutralBase-50">
                {t("InternalTransfers.PaymentsHubScreen.title")}
              </Typography.Text>

              <Stack direction="horizontal" gap="12p" align="center" justify="space-between">
                {account.data !== undefined ? (
                  <>
                    {/* Card mock */}
                    <View style={mockCardStyle} />
                    <Stack direction="vertical" style={styles.expandText}>
                      {/* TODO: replace mock account info */}
                      <Typography.Text color="neutralBase-50" size="callout">
                        {account.data.name}
                      </Typography.Text>
                      <Typography.Text color="neutralBase" size="footnote">
                        {t("InternalTransfers.PaymentsHubScreen.balanceAvailable", {
                          balance: formatCurrency(account.data.balance, "SAR"),
                        })}
                      </Typography.Text>
                    </Stack>
                  </>
                ) : (
                  <View />
                )}
                {/* TODO: not working on search functionality yet */}
                <Pressable style={searchContainer}>
                  <SearchIcon color={searchIconColor} />
                </Pressable>
              </Stack>
            </Stack>
          </SafeAreaView>
        </View>
        <ScrollView contentContainerStyle={contentStyle}>
          <Stack direction="vertical" gap="32p" align="stretch">
            <PaymentOption
              onPress={() => setIsSelectTransferTypeVisible(true)}
              icon={<LocalTransferIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.localTransfer.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.localTransfer.helperText")}
            />
            <PaymentOption
              onPress={handleOnInternalTransferPress}
              icon={<TransferHorizontalIcon />}
              title={t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.title")}
              helperText={t("InternalTransfers.PaymentsHubScreen.options.internalTransfer.helperText")}
            />
          </Stack>
        </ScrollView>
        <SelectTransferTypeModal
          isVisible={isSelectTransferTypeVisible}
          onClose={() => setIsSelectTransferTypeVisible(false)}
          onQuickTransferPress={handleOnQuickTransferPress}
          onStandardTransferPress={handleStandardTransferPress}
        />
        {isSelectInternalTransferTypeVisible ? (
          <InternalTransferTypeModal
            onClose={() => setIsSelectInternalTransferTypeVisible(false)}
            onCroatiaPress={handleOnCroatiaTransferPress}
            onAlrajhiPress={handleOnAlrajhiTransferPress}
          />
        ) : null}
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
