import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { InfoContainer } from "../components";
import { billDetailsMock } from "../mocks/billDetailsMock";

export default function BillSavedSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnClosePress = () => {
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };

  const handleOnPayNowPress = () => {
    //TODO: navigate to pay now
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
            <TickCircleIcon height={66} width={66} color={iconColor} />
          </View>
          <Typography.Text size="title1" weight="bold" color="neutralBase-60" align="center" style={titleStyle}>
            {t("SadadBillPayments.BillSavedSuccessScreen.billAddedText")}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase-20" align="center" style={messageStyle}>
            {t("SadadBillPayments.BillSavedSuccessScreen.viewBillText")}
          </Typography.Text>
        </View>
        <Stack direction="horizontal">
          <View style={detailContainer}>
            <Stack direction="horizontal" justify="space-between">
              <Stack direction="vertical">
                <Typography.Text color="neutralBase-20" size="callout">
                  {t("SadadBillPayments.BillSavedSuccessScreen.billDescriptionText")}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="title2">
                  {billDetailsMock.billDescription}
                </Typography.Text>
              </Stack>
              <View style={iconContainer}>
                <Image source={require("../assets/images/stc-logo.png")} />
              </View>
            </Stack>
          </View>
        </Stack>
        <Stack style={marginLineStyle} direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.billAmountText")}
            body={billDetailsMock.billAmount + " SAR"}
          />
        </Stack>
        <Stack style={marginLineStyle} direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.currentDueText")}
            body={format(new Date(billDetailsMock.dueDate), "dd MMM YYY")}
          />
        </Stack>
        <Stack direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.accountNumberText")}
            body={billDetailsMock.billingAccount}
          />
        </Stack>
        <Stack style={marginLineStyle} direction="horizontal">
          <InfoContainer
            title={t("SadadBillPayments.BillSavedSuccessScreen.billerNumberText")}
            body={billDetailsMock.billerID}
            hasBottomRadius
          />
        </Stack>
        <Stack align="stretch" direction="vertical" gap="8p" style={styles.buttonContainer}>
          <Button color="dark" variant="primary" onPress={handleOnPayNowPress}>
            {t("SadadBillPayments.BillSavedSuccessScreen.buttonTitle")}
          </Button>
          <Button color="dark" variant="tertiary" onPress={handleOnClosePress}>
            {t("SadadBillPayments.BillSavedSuccessScreen.closeText")}
          </Button>
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
