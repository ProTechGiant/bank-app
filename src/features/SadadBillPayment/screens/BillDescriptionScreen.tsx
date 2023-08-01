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

export default function BillDescriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { navigationType, billDetails } = useSadadBillPaymentContext();

  const onEditPress = () => {
    navigation.navigate("SadadBillPayments.EditBillDescriptionModalScreen");
  };

  const handleOnAddBill = () => {
    if (navigationType === "oneTimePayment") {
      navigation.navigate("SadadBillPayments.EnterBillAmountScreen");
    } else {
      navigation.navigate("SadadBillPayments.BillSavedSuccessScreen");
    }
  };

  const handleOnCancel = () => {
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };
  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
    flex: 1,
  }));

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Page>
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        withBackButton={false}
        title={t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")}
        subTitle={billDetails.billIssuer}
      />
      <ContentContainer style={mainContainerStyle}>
        <Stack direction="vertical">
          <Typography.Text color="neutralBase+10" size="callout" weight="regular">
            {t("SadadBillPayments.BillDescriptionScreen.billDescriptionText")}
          </Typography.Text>
          <Stack direction="horizontal" justify="space-between" align="center">
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {billDetails.description}
            </Typography.Text>
            <View style={styles.editIconView}>
              <Pressable onPress={onEditPress}>
                <EditIcon color={editIconColor} />
              </Pressable>
            </View>
          </Stack>
        </Stack>
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
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.billAmount")}
              </Typography.Text>
              <Typography.Text weight="regular" size="title2">
                {billDetailsMock.billAmount}
                <Typography.Text size="footnote"> {billDetailsMock.billAmountCurrency}</Typography.Text>
              </Typography.Text>
            </View>
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
        <Button onPress={handleOnAddBill}>
          {navigationType === "payBill"
            ? t("SadadBillPayments.BillDescriptionScreen.payBillText")
            : t("SadadBillPayments.BillDescriptionScreen.buttonText")}
        </Button>
        {navigationType === "payBill" ? (
          <Button variant="tertiary" onPress={handleOnCancel}>
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
