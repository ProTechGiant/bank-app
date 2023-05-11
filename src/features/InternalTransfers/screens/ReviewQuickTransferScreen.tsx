import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import i18n from "@/i18n";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { useTransferFees, useTransferReasonsByCode } from "../hooks/query-hooks";

export default function ReviewQuickTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "InternalTransfers.ReviewQuickTransferScreen">>();

  const account = useCurrentAccount();
  const transferFeesAsync = useTransferFees("110");
  const transferReason = useTransferReasonsByCode(route.params.ReasonCode, 110);

  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    setIsErrorModalVisible(transferFeesAsync.isError);
  }, [transferFeesAsync.isError]);

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const handleSendMoney = async () => {
    if (
      account.data === undefined ||
      route.params.ReasonCode === undefined ||
      route.params.PaymentAmount === undefined ||
      route.params.Beneficiary.FullName === undefined ||
      transferFeesAsync.data?.TransferFee === undefined
    ) {
      return;
    }

    //@todo otp flow
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const handleOnContinue = () => {
    setIsVisible(false);
  };

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  const verticalSpaceStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["32p"] + theme.spacing["4p"],
  }));

  const inlineText = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton />
        <ContentContainer isScrollView>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <View>
              <Typography.Text color="neutralBase+30" weight="semiBold" size="title1" style={titleStyle}>
                {t("InternalTransfers.ReviewQuickTransferScreen.title")}
              </Typography.Text>
              <View style={verticalSpaceStyle}>
                <Typography.Text weight="regular" size="footnote" color="neutralBase">
                  {t("InternalTransfers.ReviewQuickTransferScreen.from")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                  {account.data?.name}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                  {account.data?.accountNumber}
                </Typography.Text>
              </View>
              <View style={verticalSpaceStyle}>
                <Typography.Text weight="regular" size="footnote" color="neutralBase">
                  {t("InternalTransfers.ReviewQuickTransferScreen.to")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                  {route.params.Beneficiary.FullName}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                  {route.params.Beneficiary.IBAN}
                </Typography.Text>
              </View>
              <View style={separatorStyle} />
              <View style={inlineText}>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {t("InternalTransfers.ReviewQuickTransferScreen.bank")}
                </Typography.Text>
                <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                  {i18n.language === "en"
                    ? route.params.Beneficiary.Bank.EnglishName
                    : route.params.Beneficiary.Bank.ArabicName}
                </Typography.Text>
              </View>
              <View style={inlineText}>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {t("InternalTransfers.ReviewQuickTransferScreen.reason")}
                </Typography.Text>
                <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                  {transferReason.data === undefined ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    transferReason.data.Description
                  )}
                </Typography.Text>
              </View>
              <View style={inlineText}>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {t("InternalTransfers.ReviewQuickTransferScreen.processingTime")}
                </Typography.Text>
                <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                  {t("InternalTransfers.ReviewQuickTransferScreen.sameDay")}
                </Typography.Text>
              </View>
              <View style={inlineText}>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {t("InternalTransfers.ReviewQuickTransferScreen.fee")}
                </Typography.Text>
                {transferFeesAsync.data === undefined ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                    {formatCurrency(
                      Number(transferFeesAsync.data?.TransferFee),
                      t("InternalTransfers.ReviewQuickTransferScreen.currency")
                    )}
                  </Typography.Text>
                )}
              </View>
              <View style={inlineText}>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {t("InternalTransfers.ReviewTransferScreen.total")}
                </Typography.Text>
                <Typography.Text weight="medium" size="callout" color="neutralBase+30">
                  {formatCurrency(
                    route.params.PaymentAmount + Number(transferFeesAsync.data?.TransferFee),
                    t("InternalTransfers.ReviewQuickTransferScreen.currency")
                  )}
                </Typography.Text>
              </View>
            </View>
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button onPress={() => handleSendMoney()} variant="primary">
                {t("InternalTransfers.ReviewQuickTransferScreen.sendMoney")}
              </Button>
              <Button onPress={() => handleOnClose()} variant="tertiary">
                {t("InternalTransfers.ReviewQuickTransferScreen.cancel")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="confirmations"
        buttons={{
          primary: (
            <Button onPress={handleOnCancel}>
              {t("InternalTransfers.ReviewQuickTransferScreen.notification.cancel")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnContinue}>
              {t("InternalTransfers.ReviewQuickTransferScreen.notification.continue")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.ReviewQuickTransferScreen.notification.message")}
        title={t("InternalTransfers.ReviewQuickTransferScreen.notification.title")}
        isVisible={isVisible}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewQuickTransferScreen.feesError.title")}
        message={t("InternalTransfers.ReviewQuickTransferScreen.feesError.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}
