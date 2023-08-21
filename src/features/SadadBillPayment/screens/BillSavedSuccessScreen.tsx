import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { CheckCircleIcon, TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import formatDateString from "@/utils/format-date-string";
import formatDateToTime from "@/utils/format-date-to-time";

import { InfoContainer } from "../components";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";

export default function BillSavedSuccessScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, navigationType, setNavigationType } = useSadadBillPaymentContext();

  const billDescriptionEn = billDetails?.BillDescriptionList?.find(bill => bill.LanguagePreference === "en-gb");
  const billDescriptionAr = billDetails?.BillDescriptionList?.find(bill => bill.LanguagePreference === "en-gb");

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

  const marginLineStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"] / 2,
  }));

  const detailContainer = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    backgroundColor: theme.palette["primaryBase-70-8%"],
    padding: theme.spacing["16p"],
    borderTopRightRadius: theme.spacing["4p"],
    borderTopLeftRadius: theme.spacing["4p"],
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
            {navigationType === "saveBill" ? (
              <TickCircleIcon height={66} width={66} color={iconColor} />
            ) : (
              <CheckCircleIcon height={66} width={66} color={iconColor} />
            )}
          </View>
          <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
            {navigationType === "oneTimePayment" || navigationType === "payBill"
              ? t("SadadBillPayments.BillSavedSuccessScreen.billPaidText")
              : t("SadadBillPayments.BillSavedSuccessScreen.billAddedText")}
          </Typography.Text>
          {navigationType === "oneTimePayment" || navigationType === "payBill" ? null : (
            <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
              {t("SadadBillPayments.BillSavedSuccessScreen.viewBillText")}
            </Typography.Text>
          )}
        </View>
        <Stack direction="horizontal">
          <View style={detailContainer}>
            <Stack direction="horizontal" justify="space-between">
              <Stack direction="vertical">
                <Typography.Text color="neutralBase-20" size="callout">
                  {t("SadadBillPayments.BillSavedSuccessScreen.billDescriptionText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="title2">
                  {billDetails.Description === undefined
                    ? i18n.language === "en"
                      ? billDescriptionEn?.Text
                      : billDescriptionAr?.Text
                    : billDetails.Description}
                </Typography.Text>
              </Stack>
              <View style={iconContainer}>
                <Image source={require("../assets/images/stc-logo.png")} />
              </View>
            </Stack>
          </View>
        </Stack>
        {navigationType === "saveBill" ? (
          <Stack style={marginLineStyle} direction="horizontal">
            <InfoContainer
              title={t("SadadBillPayments.BillSavedSuccessScreen.billAmountText")}
              body={billDetails.BillAmount + " " + billDetails.BillAmountCurrency}
            />
          </Stack>
        ) : (
          <Stack style={marginLineStyle} direction="horizontal">
            <InfoContainer
              title={t("SadadBillPayments.BillSavedSuccessScreen.paidAmountText")}
              body={
                billDetails.OtherBillAmount === undefined
                  ? billDetails.BillAmount
                  : billDetails.OtherBillAmount + " " + billDetails.BillAmountCurrency
              }
            />
          </Stack>
        )}
        {navigationType === "saveBill" ? (
          <Stack style={marginLineStyle} direction="horizontal">
            <InfoContainer
              title={t("SadadBillPayments.BillSavedSuccessScreen.currentDueText")}
              body={formatDateString(billDetails.DueDate)}
            />
          </Stack>
        ) : (
          <Stack style={marginLineStyle} direction="horizontal">
            <InfoContainer
              title={t("SadadBillPayments.BillSavedSuccessScreen.dateTimeText")}
              body={
                formatDateString(billDetails.DueDate) +
                ` ${t("SadadBillPayments.BillSavedSuccessScreen.atText")} ` +
                formatDateToTime(billDetails.DueDate)
              }
            />
          </Stack>
        )}
        <Stack style={navigationType === "saveBill" ? null : marginLineStyle} direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.accountNumberText")}
            body={billDetails.BillingAccount}
          />
        </Stack>
        <Stack style={marginLineStyle} direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.billerNumberText")}
            body={billDetails.BillerId}
            hasBottomRadius
          />
        </Stack>
        {navigationType === "payBill" || navigationType === "oneTimePayment" ? (
          <Stack style={marginLineStyle} direction="horizontal">
            <InfoContainer
              title={t("SadadBillPayments.BillSavedSuccessScreen.referenceNumberText")}
              // TODO: Will remove the mock value once the API supports implemented
              body="182738374"
              hasBottomRadius
            />
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
