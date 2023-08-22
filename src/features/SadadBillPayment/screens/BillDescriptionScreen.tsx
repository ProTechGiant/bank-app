import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageStyle, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NetworkImage from "@/components/NetworkImage";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PlaceholderImage from "@/components/PlaceholderImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import formatDateString from "@/utils/format-date-string";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useAddBill } from "../hooks/query-hooks";
import { AddBillInterface } from "../types";

export default function BillDescriptionScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const { navigationType, billDetails } = useSadadBillPaymentContext();
  const addBillAsync = useAddBill();
  const otpFlow = useOtpFlow();

  const [warningModal, setWarningModal] = useState(false);

  const handleOnDescriptionEditPress = () => {
    navigation.navigate("SadadBillPayments.EditBillDescriptionModalScreen");
  };

  const handleOnCancelAddBill = () => {
    setWarningModal(false);
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };

  const handleOnAddBill = () => {
    if (navigationType === "oneTimePayment") {
      navigation.navigate("SadadBillPayments.EnterBillAmountScreen", { from: "PayBill" });
    } else {
      handleOtpFlow();
    }
  };

  const handleOnCancel = () => {
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };

  const handleOtpFlow = async () => {
    // Following bill detail values are not available in context as previous screen Api not implemented, to test the flow we need to use hard code value
    // ServiceType: "LLIN",BillerId: "001", BillNumber: "00100100013", BillingAccount: "009668552251",
    if (
      billDetails.Category?.Code === undefined ||
      billDetails.BillIssuer?.Id === undefined ||
      billDetails.BillNumber === undefined ||
      billDetails.AccountNumber === undefined ||
      billDetails.Description === undefined
    ) {
      return;
    }
    const addBillRequest: AddBillInterface = {
      ServiceType: billDetails.Category.Code,
      BillerId: billDetails.BillIssuer.Id,
      BillNumber: billDetails.BillNumber,
      BillingAccount: billDetails.AccountNumber,
      BillDescriptionList: [
        {
          LanguagePreference: i18n.language === "en" ? "en-gb" : "ar-sa",
          Text: billDetails.Description,
        },
      ],
    };

    otpFlow.handle({
      action: {
        to: "SadadBillPayments.BillDescriptionScreen",
      },
      //Adding mock values(PhoneNumber)for passing the QA testing criteria.
      //once logging in is handled properly, we will get this value from backend and we will replace this mock value with the value stored in local storage.
      //TODO Replace with params once we get the value from backend response.
      otpChallengeParams: {
        PhoneNumber: "+961549845741",
      },
      otpVerifyMethod: "payments/sadad",

      onOtpRequest: () => {
        return addBillAsync.mutateAsync(addBillRequest);
      },
      onFinish: status => {
        if (status !== "cancel" && status !== "fail") {
          navigation.navigate("SadadBillPayments.BillSavedSuccessScreen");
        }
      },
    });
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
    flex: 1,
  }));

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
  }));

  return (
    <Page>
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => setWarningModal(true)} />}
        withBackButton={false}
        title={
          navigationType === "oneTimePayment"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
            : navigationType === "saveBill"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")
            : t("SadadBillPayments.SelectBillerCategoryScreen.payBillTitle")
        }
        subTitle={i18n.language === "en" ? billDetails.BillIssuer?.NameEn : billDetails.BillIssuer?.NameAr}
      />
      <ContentContainer style={mainContainerStyle}>
        <Stack direction="vertical">
          <Typography.Text color="neutralBase+10" size="callout" weight="regular">
            {t("SadadBillPayments.BillDescriptionScreen.billDescriptionText")}
          </Typography.Text>
          <Stack direction="horizontal" justify="space-between" align="center">
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {billDetails.Description}
            </Typography.Text>
            <View style={styles.editIconView}>
              <Pressable onPress={handleOnDescriptionEditPress}>
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
                  {billDetails.ServiceType}
                </Typography.Text>
              </View>
              <View>
                {billDetails.BillIssuer?.LogoUrl !== undefined ? (
                  <NetworkImage source={{ uri: billDetails.BillIssuer.LogoUrl }} style={imageStyle} />
                ) : (
                  <PlaceholderImage style={imageStyle} />
                )}
              </View>
            </Stack>
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.billAmount")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {billDetails.BillAmount}
                <Typography.Text size="footnote"> {billDetails.BillAmountCurrency}</Typography.Text>
              </Typography.Text>
            </View>
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
                {billDetails.AccountNumber}
              </Typography.Text>
            </View>
            <View>
              <Typography.Text color="neutralBase" weight="medium" size="callout">
                {t("SadadBillPayments.BillDetailsScreen.billerNumber")}
              </Typography.Text>
              <Typography.Text weight="regular" size="body">
                {billDetails.BillIssuer?.Id}
              </Typography.Text>
            </View>
          </Stack>
        </View>
        <Button onPress={handleOnAddBill}>
          {navigationType === "payBill" || navigationType === "oneTimePayment"
            ? t("SadadBillPayments.BillDescriptionScreen.payBillText")
            : t("SadadBillPayments.BillDescriptionScreen.buttonText")}
        </Button>
        {navigationType === "payBill" || navigationType === "oneTimePayment" ? (
          <Button variant="tertiary" onPress={handleOnCancel}>
            {t("SadadBillPayments.BillDescriptionScreen.cancelText")}
          </Button>
        ) : null}
        <NotificationModal
          onClose={() => {
            setWarningModal(false);
          }}
          message={t("SadadBillPayments.EnterAccountNoScreen.warningModal.message")}
          isVisible={warningModal}
          title={t("SadadBillPayments.EnterAccountNoScreen.warningModal.title")}
          variant="warning"
          buttons={{
            primary: (
              <Button onPress={() => handleOnCancelAddBill()}>
                {t("SadadBillPayments.EnterAccountNoScreen.warningModal.buttonCancelText")}
              </Button>
            ),
          }}
        />
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
