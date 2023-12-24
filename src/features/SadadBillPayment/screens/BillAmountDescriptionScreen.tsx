import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { EditIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import formatDateString from "@/utils/format-date-string";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { usePayBill } from "../hooks/query-hooks";
import { PayBillInterface } from "../types";

export default function BillAmountDescriptionScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { navigationType, billDetails } = useSadadBillPaymentContext();
  const payBillAsync = usePayBill();
  const otpFlow = useOtpFlow();

  const [isBalanceErrorVisible, setIsBalanceErrorVisible] = useState(false);

  const handleOnAmountEditPress = () => {
    navigation.navigate("SadadBillPayments.EnterBillAmountScreen", { from: "Edit" });
  };

  const handleOnAddBillPress = () => {
    const payBillRequest: PayBillInterface = {
      TransactionType: "PAY",
      ServiceType: billDetails.ServiceType,
      BillerId: billDetails.BillerId,
      BillAmount: billDetails.BillAmount,
      BillAmountCurrency: billDetails.BillAmountCurrency,
      PaidAmount: billDetails.OtherBillAmount === undefined ? billDetails.BillAmount : billDetails.OtherBillAmount,
      PaidAmountCurrency: billDetails.PaidAmountCurrency,
      ExactPaymentRequired: billDetails.ExactPaymentRequired ? "Y" : "N",
      BillCategory: billDetails.BillCategory,
      BillType: billDetails.BillType,
      BillNumber: billDetails.BillNumber,
      BillingAccount: billDetails.BillingAccount,
      DisplayLabelEn: billDetails.BillIssuer?.NameEn,
      DisplayLabelAr: billDetails.BillIssuer?.NameAr,
      IsPartialPaymentAllowed: billDetails?.IsPartialPaymentAllowed ?? null,
      IsOverPaymentAllowed: billDetails?.IsOverPaymentAllowed ?? null,
      IsAdvancePaymentAllowed: billDetails?.IsAdvancePaymentAllowed ?? null,
      PaymentRangesLower: billDetails?.PaymentRangesLower ?? null,
      PaymentRangesUpper: billDetails?.PaymentRangesUpper ?? null,
    };

    const payBillDetailRequestParam = {
      ...payBillRequest,
      ...(i18n.language === "en"
        ? { DescriptionEn: billDetails.Description }
        : { DescriptionAr: billDetails.Description }),
    };

    otpFlow.handle({
      action: {
        to: "SadadBillPayments.BillAmountDescriptionScreen",
      },
      otpVerifyMethod: "payments/sadad",

      onOtpRequest: () => {
        return payBillAsync.mutateAsync(payBillDetailRequestParam);
      },
      onFinish: (status, _payload, errorId) => {
        if (status !== "cancel" && status !== "fail") {
          navigation.navigate("SadadBillPayments.BillSavedSuccessScreen");
        } else if (status === "cancel" && errorId === "0083") {
          delayTransition(() => {
            setIsBalanceErrorVisible(true);
          });
        }
      },
    });
  };

  const handleOnAddTopup = () => {
    setIsBalanceErrorVisible(false);
    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
    flex: 1,
  }));

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          withBackButton={false}
          title={
            navigationType === "oneTimePayment"
              ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
              : t("SadadBillPayments.SelectBillerCategoryScreen.payBillTitle")
          }
          subTitle={i18n.language === "en" ? billDetails.BillIssuer?.NameEn : billDetails.BillIssuer?.NameAr}
        />
        <ContentContainer style={mainContainerStyle}>
          <View style={mainContainerStyle}>
            <Stack direction="vertical" gap="20p" align="stretch">
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("SadadBillPayments.BillAmountDescriptionScreen.confirmBillDetails")}
              </Typography.Text>
              <Stack direction="horizontal" align="center" justify="space-between">
                <View>
                  <Typography.Text color="neutralBase" weight="medium" size="callout">
                    {t("SadadBillPayments.BillDetailsScreen.billProvider")}
                  </Typography.Text>
                  <Typography.Text weight="regular" size="body">
                    {billDetails.ServiceType}
                  </Typography.Text>
                </View>
                <View>
                  <Image source={require("../assets/images/stc-logo.png")} />
                </View>
              </Stack>

              {navigationType !== "payBill" ? (
                <Stack direction="vertical">
                  <Typography.Text color="neutralBase+10" size="callout" weight="regular">
                    {t("SadadBillPayments.BillDescriptionScreen.billDescriptionText")}
                  </Typography.Text>
                  <Typography.Text weight="regular" size="body">
                    {billDetails.Description}
                  </Typography.Text>
                </Stack>
              ) : null}

              <View>
                <Typography.Text color="neutralBase" weight="medium" size="callout">
                  {t("SadadBillPayments.BillDetailsScreen.billAmount")}
                </Typography.Text>
                <Typography.Text weight="regular" size="body">
                  {billDetails.BillAmount}
                  <Typography.Text size="footnote"> {billDetails.BillAmountCurrency}</Typography.Text>
                </Typography.Text>
              </View>

              <Stack direction="vertical">
                <Typography.Text color="neutralBase+10" size="callout" weight="regular">
                  {t("SadadBillPayments.BillDescriptionScreen.YouArePayingText")}
                </Typography.Text>
                <Stack direction="horizontal" justify="space-between" align="center">
                  <Typography.Text color="neutralBase+30" weight="medium" size="title2">
                    {billDetails.OtherBillAmount === undefined ? billDetails.BillAmount : billDetails.OtherBillAmount}
                    <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                      {" " + t("Currency.sar")}
                    </Typography.Text>
                  </Typography.Text>
                  <View style={styles.editIconView}>
                    <Pressable onPress={handleOnAmountEditPress}>
                      <EditIcon color={editIconColor} />
                    </Pressable>
                  </View>
                </Stack>
              </Stack>
              <View>
                <Typography.Text color="neutralBase" weight="medium" size="callout">
                  {t("SadadBillPayments.BillDetailsScreen.currentDueDate")}
                </Typography.Text>
                <Typography.Text weight="regular" size="body">
                  {formatDateString(billDetails.DueDate)}
                </Typography.Text>
              </View>
              <View>
                <Typography.Text color="neutralBase" weight="medium" size="callout">
                  {t("SadadBillPayments.BillDetailsScreen.accountNumber")}
                </Typography.Text>
                <Typography.Text weight="regular" size="body">
                  {billDetails.BillingAccount}
                </Typography.Text>
              </View>
              <View>
                <Typography.Text color="neutralBase" weight="medium" size="callout">
                  {t("SadadBillPayments.BillDetailsScreen.billerNumber")}
                </Typography.Text>
                <Typography.Text weight="regular" size="body">
                  {billDetails.BillerId}
                </Typography.Text>
              </View>
            </Stack>
          </View>
          <Button onPress={handleOnAddBillPress}>{t("SadadBillPayments.BillAmountDescriptionScreen.confirm")}</Button>
        </ContentContainer>
      </Page>

      <NotificationModal
        variant="error"
        title={t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.title")}
        message={t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.message")}
        isVisible={isBalanceErrorVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnAddTopup}>
              {t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.primaryButtonText")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsBalanceErrorVisible(false)}>
              {t("SadadBillPayments.EnterAccountNoScreen.insufficientBalanceError.secondaryButtonText")}
            </Button>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  editIconView: {
    alignItems: "flex-end",
    flex: 1,
  },
});
