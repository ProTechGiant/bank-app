import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
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
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useTransferLimitAmount } from "@/hooks/use-transfer-limit";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatCurrency } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import {
  useLocalTransferForIPS,
  useLocalTransferForSarie,
  useTransferFees,
  useTransferReasonsByCode,
} from "../hooks/query-hooks";
import { LocalTransfer } from "../types";

export default function ReviewQuickTransferScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ReviewLocalTransferScreen">>();

  const { transferType, transferAmount } = useInternalTransferContext();
  const account = useCurrentAccount();
  const transferFeesAsync = useTransferFees(transferType);
  const transferReason = useTransferReasonsByCode(
    route.params.ReasonCode,
    transferType === "SARIE_TRANSFER_ACTION" ? TransferType.SarieTransferAction : TransferType.IpsTransferAction
  );
  const localTransferForSarieAsync = useLocalTransferForSarie();
  const localTransferForIPSAsync = useLocalTransferForIPS();

  const otpFlow = useOtpFlow();

  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isErrorTransferLimit, setIsErrorTransferLimit] = useState(false);

  const currentAccountBalance = (account && account.data && account.data.balance) ?? 0;

  useEffect(() => {
    setIsErrorModalVisible(transferFeesAsync.isError);
  }, [transferFeesAsync]);

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const { transferLimitAmount } = useTransferLimitAmount(String(account?.data?.id));

  const handleSendMoney = async () => {
    if (
      account.data === undefined ||
      route.params.ReasonCode === undefined ||
      route.params.PaymentAmount === undefined ||
      route.params.Beneficiary.FullName === undefined ||
      transferFeesAsync.data?.TransferFee === undefined ||
      transferAmount === undefined
    ) {
      return;
    }

    if (transferAmount > transferLimitAmount || transferAmount > currentAccountBalance) {
      setIsErrorTransferLimit(true);
      return;
    }
    setIsErrorTransferLimit(false);

    const localTransferRequest: LocalTransfer = {
      transferAmount: route.params.PaymentAmount,
      transferAmountCurrency: "SAR",
      remitterIBAN: account.data.iban ?? "",
      remitterName: account.data.owner ?? "",
      beneficiaryIBAN: route.params.Beneficiary.IBAN,
      beneficiaryName: route.params.Beneficiary.FullName,
      clientTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      expressTransferFlag: transferType === "SARIE_TRANSFER_ACTION" ? "N" : "Y",
      transferPurpose: route.params.ReasonCode,
      transferType: "04",
      customerRemarks: "Customer Remarks", // @todo update with correct value, as default for now is this
    };

    otpFlow.handle({
      action: {
        to: "InternalTransfers.ReviewLocalTransferScreen",
        params: route.params,
      },
      //Adding mock values(PhoneNumber)for passing the QA testing criteria.
      //once logging in is handled properly, we will get this value from backend and we will replace this mock value with the value stored in local storage.
      //TODO Replace with params once we get the value from backend response.

      otpChallengeParams: {
        PhoneNumber: "+961549845741",
      },
      otpVerifyMethod: transferType === "SARIE_TRANSFER_ACTION" ? "sarie" : "ips-payment",
      onOtpRequest: () => {
        return transferType === "SARIE_TRANSFER_ACTION"
          ? localTransferForSarieAsync.mutateAsync(localTransferRequest)
          : localTransferForIPSAsync.mutateAsync(localTransferRequest);
      },
      onFinish: status => {
        if (status === "cancel") {
          return;
        }
        if (status === "fail") {
          if (transferType === TransferType.SarieTransferAction) {
            setIsGenericErrorModalVisible(false);
          } else {
            delayTransition(() => setIsGenericErrorModalVisible(true));
          }
        } else {
          navigation.navigate("InternalTransfers.ConfirmationScreen");
        }
      },
    });
  };

  const handleOnCancel = () => {
    setIsVisible(false);

    transferType === "SARIE_TRANSFER_ACTION"
      ? navigation.navigate("InternalTransfers.StandardTransferScreen")
      : navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const handleOnContinue = () => {
    setIsVisible(false);
  };

  const handleOnDone = () => {
    setIsErrorTransferLimit(false);

    transferType === "SARIE_TRANSFER_ACTION"
      ? navigation.navigate("InternalTransfers.StandardTransferScreen")
      : navigation.navigate("InternalTransfers.QuickTransferScreen");
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

  const renderFromSection = () => {
    return (
      <View style={verticalSpaceStyle}>
        <Typography.Text
          weight="semiBold"
          size="footnote"
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase+30" : "neutralBase"}>
          {t("InternalTransfers.ReviewQuickTransferScreen.from")}
        </Typography.Text>
        <Typography.Text
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase" : "neutralBase+30"}
          weight="regular"
          size="callout">
          {account.data?.owner}
        </Typography.Text>
        <Typography.Text
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase" : "neutralBase+30"}
          weight="regular"
          size="callout">
          {account.data?.iban}
        </Typography.Text>
      </View>
    );
  };

  const renderToSection = () => {
    return (
      <View style={verticalSpaceStyle}>
        <Typography.Text
          weight="semiBold"
          size="footnote"
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase+30" : "neutralBase"}>
          {t("InternalTransfers.ReviewQuickTransferScreen.to")}
        </Typography.Text>
        <Typography.Text
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase" : "neutralBase+30"}
          weight="regular"
          size="callout">
          {route.params.Beneficiary.FullName}
        </Typography.Text>
        <Typography.Text
          color={transferType === "SARIE_TRANSFER_ACTION" ? "neutralBase" : "neutralBase+30"}
          weight="regular"
          size="callout">
          {route.params.Beneficiary.IBAN}
        </Typography.Text>
      </View>
    );
  };

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
              {transferType === "SARIE_TRANSFER_ACTION" ? (
                <>
                  {renderToSection()}
                  {renderFromSection()}
                </>
              ) : (
                <>
                  {renderFromSection()}
                  {renderToSection()}
                </>
              )}
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
                  {transferType === "SARIE_TRANSFER_ACTION"
                    ? t("InternalTransfers.ReviewQuickTransferScreen.feeInclVAT")
                    : t("InternalTransfers.ReviewQuickTransferScreen.fee")}
                </Typography.Text>
                {transferFeesAsync.data === undefined ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Typography.Text color="neutralBase-10" weight="regular" size="callout">
                    {formatCurrency(
                      Number(transferFeesAsync.data.TransferFee + transferFeesAsync.data.VatFee),
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
                    route.params.PaymentAmount,
                    t("InternalTransfers.ReviewQuickTransferScreen.currency")
                  )}
                </Typography.Text>
              </View>
            </View>
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button onPress={() => handleSendMoney()} variant="primary">
                {transferType === TransferType.SarieTransferAction
                  ? t("InternalTransfers.ReviewQuickTransferScreen.transferNow")
                  : t("InternalTransfers.ReviewQuickTransferScreen.sendMoney")}
              </Button>
              <Button onPress={() => handleOnClose()} variant="tertiary">
                {t("InternalTransfers.ReviewQuickTransferScreen.cancel")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="warning"
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
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => setIsGenericErrorModalVisible(false)}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.transferLimitError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.transferLimitError.message")}
        isVisible={isErrorTransferLimit}
        onClose={() => setIsErrorTransferLimit(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnDone}>{t("InternalTransfers.ReviewTransferScreen.notification.done")}</Button>
          ),
        }}
      />
    </>
  );
}
