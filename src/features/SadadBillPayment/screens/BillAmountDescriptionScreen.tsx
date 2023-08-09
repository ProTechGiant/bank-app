import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { billDetailsMock } from "../mocks/billDetailsMock";

export default function BillAmountDescriptionScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { navigationType, billDetails } = useSadadBillPaymentContext();

  const handleOnAmountEditPress = () => {
    navigation.navigate("SadadBillPayments.EnterBillAmountScreen");
  };

  const handleOnAddBillPress = () => {
    navigation.navigate("SadadBillPayments.BillSavedSuccessScreen");
  };

  const handleOnCancelPress = () => {
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };
  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
    flex: 1,
  }));

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Page>
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        withBackButton={false}
        title={
          navigationType === "oneTimePayment"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
            : t("SadadBillPayments.SelectBillerCategoryScreen.payBilltTitle")
        }
        subTitle={i18n.language === "en" ? billDetails.billIssuer?.NameEn : billDetails.billIssuer?.NameAr}
      />
      <ContentContainer style={mainContainerStyle}>
        <View style={mainContainerStyle}>
          <Stack direction="vertical" gap="20p" align="stretch">
            <Stack direction="horizontal" align="center" justify="space-between">
              <View>
                <Typography.Text color="neutralBase" weight="medium" size="callout">
                  {t("SadadBillPayments.BillDetailsScreen.billProvider")}
                </Typography.Text>
                <Typography.Text weight="regular" size="body">
                  {billDetailsMock.serviceType}
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
                  {billDetails.description}
                </Typography.Text>
              </Stack>
            ) : null}

            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.billAmount")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {billDetailsMock.billAmount}
                <Typography.Text size="footnote"> {billDetailsMock.billAmountCurrency}</Typography.Text>
              </Typography.Text>
            </View>

            {billDetails.otherBillAmount !== undefined ? (
              <Stack direction="vertical">
                <Typography.Text color="neutralBase+10" size="callout" weight="regular">
                  {t("SadadBillPayments.BillDescriptionScreen.YouArePayingText")}
                </Typography.Text>
                <Stack direction="horizontal" justify="space-between" align="center">
                  <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                    {billDetails.otherBillAmount}
                  </Typography.Text>
                  <View style={styles.editIconView}>
                    <Pressable onPress={handleOnAmountEditPress}>
                      <EditIcon color={editIconColor} />
                    </Pressable>
                  </View>
                </Stack>
              </Stack>
            ) : null}
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.currentDueDate")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {format(new Date(billDetailsMock.dueDate), "dd MMM YYY")}
              </Typography.Text>
            </View>
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.accountNumber")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {billDetailsMock.billingAccount}
              </Typography.Text>
            </View>
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.billerNumber")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {billDetailsMock.billerID}
              </Typography.Text>
            </View>
          </Stack>
        </View>
        <Button onPress={handleOnAddBillPress}>{t("SadadBillPayments.BillDescriptionScreen.payBillText")}</Button>
        {navigationType === "payBill" ? (
          <Button variant="tertiary" onPress={handleOnCancelPress}>
            {t("SadadBillPayments.BillDescriptionScreen.cancelText")}
          </Button>
        ) : null}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  editIconView: {
    alignItems: "flex-end",
    flex: 1,
  },
});
