import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import formatDateString from "@/utils/format-date-string";
import formatDateToTime from "@/utils/format-date-to-time";

import BillAddedIcon from "../assets/bill-added.svg";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { getLanguagePreferredBillDescription } from "../helper";

export default function BillSavedSuccessScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, navigationType, setNavigationType } = useSadadBillPaymentContext();

  const handleOnClosePress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SadadBillPayments.BillPaymentHomeScreen" }],
    });
  };

  const handleOnViewPress = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "SadadBillPayments.SaveBillsScreen",
          params: {
            navigationFlow: "savedBills",
          },
        },
      ],
    });
  };

  const handleOnPayNowPress = () => {
    setNavigationType("payBill");
    navigation.reset({
      index: 0,
      routes: [{ name: "SadadBillPayments.BillAmountDescriptionScreen" }],
    });
  };

  const handleOnMakeAnotherPayment = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SadadBillPayments.BillPaymentHomeScreen" }],
    });
  };

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

  const marginLineStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"] / 2,
  }));

  const detailContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBaseHover,
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.regular,
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
    backgroundColor: "#fff", // white color is not there in palette
    borderRadius: theme.spacing["48p"] / 2,
    justifyContent: "center",
    alignItems: "center",
  }));

  return (
    <Page backgroundColor="primaryBase">
      <StatusBar barStyle="light-content" />
      <ContentContainer isScrollView>
        <View style={styles.container}>
          <View style={iconStyle}>
            <BillAddedIcon />
          </View>
          <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
            {navigationType === "oneTimePayment" || navigationType === "payBill"
              ? t("SadadBillPayments.BillSavedSuccessScreen.billPaidText")
              : t("SadadBillPayments.BillSavedSuccessScreen.billAddedText")}
          </Typography.Text>
          {navigationType === "oneTimePayment" || navigationType === "payBill" ? null : (
            <Typography.Text size="callout" color="neutralBase-60" align="center" style={messageStyle}>
              {t("SadadBillPayments.BillSavedSuccessScreen.viewBillText")}
            </Typography.Text>
          )}
        </View>
        <Stack direction="vertical" align="stretch" gap="16p" style={detailContainer}>
          <Stack direction="horizontal" justify="space-between">
            <Stack direction="vertical">
              <Typography.Text color="neutralBase-20" size="footnote">
                {t("SadadBillPayments.BillSavedSuccessScreen.billDescriptionText")}
              </Typography.Text>
              <Typography.Text color="neutralBase-60" size="callout">
                {billDetails.Description === undefined
                  ? getLanguagePreferredBillDescription(i18n.language, billDetails.BillDescriptionList)
                  : billDetails.Description}
              </Typography.Text>
            </Stack>
            <View style={iconContainer}>
              <Image source={require("../assets/images/stc-logo.png")} />
            </View>
          </Stack>
          {navigationType === "saveBill" ? (
            <Stack direction="horizontal" justify="space-between">
              <Stack direction="vertical">
                <Typography.Text color="neutralBase-20" size="footnote">
                  {t("SadadBillPayments.BillSavedSuccessScreen.billAmountText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="callout">
                  {billDetails.BillAmount + " " + billDetails.BillAmountCurrency}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" align="flex-end">
                <Typography.Text color="neutralBase-20" size="footnote">
                  {t("SadadBillPayments.BillSavedSuccessScreen.currentDueText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="callout">
                  {formatDateString(billDetails.DueDate)}
                </Typography.Text>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="horizontal" justify="space-between">
              <Stack direction="vertical">
                <Typography.Text color="neutralBase-20" size="footnote">
                  {t("SadadBillPayments.BillSavedSuccessScreen.paidAmountText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="callout">
                  {billDetails.OtherBillAmount === undefined
                    ? billDetails.BillAmount
                    : billDetails.OtherBillAmount + " " + billDetails.BillAmountCurrency}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" align="flex-end">
                <Typography.Text color="neutralBase-20" size="footnote">
                  {t("SadadBillPayments.BillSavedSuccessScreen.dateTimeText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="callout">
                  {formatDateString(billDetails.DueDate) +
                    ` ${t("SadadBillPayments.BillSavedSuccessScreen.atText")} ` +
                    formatDateToTime(billDetails.DueDate)}
                </Typography.Text>
              </Stack>
            </Stack>
          )}
          <Stack direction="horizontal" justify="space-between">
            <Stack direction="vertical">
              <Typography.Text color="neutralBase-20" size="footnote">
                {t("SadadBillPayments.BillSavedSuccessScreen.accountNumberText")}
              </Typography.Text>
              <Typography.Text color="neutralBase-60" size="callout">
                {billDetails.BillingAccount}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" align="flex-end">
              <Typography.Text color="neutralBase-20" size="footnote">
                {t("SadadBillPayments.BillSavedSuccessScreen.billerNumberText")}
              </Typography.Text>
              <Typography.Text color="neutralBase-60" size="callout">
                {billDetails.BillerId}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>

        {navigationType === "payBill" || navigationType === "oneTimePayment" ? (
          <Stack style={marginLineStyle} direction="horizontal">
            <Stack direction="vertical">
              <Typography.Text color="neutralBase-20" size="callout">
                {t("SadadBillPayments.BillSavedSuccessScreen.referenceNumberText")}
              </Typography.Text>
              <Typography.Text color="neutralBase-60" size="title2">
                {/* // TODO: Will remove the mock value once the API supports implemented */}
                182738374
              </Typography.Text>
            </Stack>
          </Stack>
        ) : null}
        <Stack align="stretch" direction="vertical" gap="8p" style={styles.buttonContainer}>
          {navigationType === "oneTimePayment" || navigationType === "payBill" ? (
            <Button color="dark" variant="primary" onPress={handleOnMakeAnotherPayment}>
              {navigationType === "oneTimePayment"
                ? t("SadadBillPayments.BillSavedSuccessScreen.doneText")
                : t("SadadBillPayments.BillSavedSuccessScreen.buttonPayTitle")}
            </Button>
          ) : (
            <Button color="dark" variant="primary" onPress={handleOnPayNowPress}>
              {t("SadadBillPayments.BillSavedSuccessScreen.buttonSavedTitle")}
            </Button>
          )}
          {navigationType === "oneTimePayment" ? (
            <Button color="dark" variant="tertiary" onPress={handleOnViewPress}>
              {t("SadadBillPayments.BillSavedSuccessScreen.viewSavedBillText")}
            </Button>
          ) : (
            <Button color="dark" variant="tertiary" onPress={handleOnClosePress}>
              {t("SadadBillPayments.BillSavedSuccessScreen.closeText")}
            </Button>
          )}
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 32,
  },
  container: {
    alignItems: "center",
  },
});
