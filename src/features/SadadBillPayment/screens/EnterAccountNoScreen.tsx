import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { numericRegExp } from "@/utils";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useBillDetailsByAccountNumber } from "../hooks/query-hooks";

export default function EnterAccountNoScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, setBillDetails, navigationType } = useSadadBillPaymentContext();

  const [accountNumber, setAccountNumber] = useState<string>("");
  const [errorModal, setErrorModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

  const { refetch, error } = useBillDetailsByAccountNumber(accountNumber, billDetails.BillIssuer?.Id);

  const handleOnSubmit = async () => {
    const { status, data } = await refetch();
    if (status === "success") {
      setBillDetails({ ...billDetails, ...data, AccountNumber: accountNumber });
      navigation.navigate("SadadBillPayments.EnterBillDescScreen");
    } else if (status === "error") {
      setErrorModal(true);
    }
  };

  const handleOnChangeText = (text: string) => {
    setAccountNumber(text);
  };

  const handleOnRetry = () => {
    handleOnSubmit();
    setErrorModal(false);
  };

  const handleOnCancelAddBill = () => {
    setWarningModal(false);
    navigation.navigate("SadadBillPayments.BillPaymentHomeScreen");
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["24p"],
  }));

  const accountFormContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => setWarningModal(true)} />}
        title={
          navigationType === "oneTimePayment"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
            : t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")
        }
        subTitle={i18n.language === "en" ? billDetails.BillIssuer?.NameEn : billDetails.BillIssuer?.NameAr}
      />
      <ContentContainer style={mainContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {t("SadadBillPayments.EnterAccountNoScreen.enterAccountNoText")}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase+10" weight="regular">
          {t("SadadBillPayments.EnterAccountNoScreen.enterAccountNoDescText")}
        </Typography.Text>
        <View style={accountFormContainerStyle}>
          <SimpleTextInput
            showCharacterCount
            extraStart={t("SadadBillPayments.EnterAccountNoScreen.textInput.validationText")}
            label={t("SadadBillPayments.EnterAccountNoScreen.textInput.label")}
            maxLength={32}
            keyboardType="number-pad"
            value={accountNumber}
            onChangeText={handleOnChangeText}
            errorText={
              accountNumber.length > 0 && !numericRegExp.test(accountNumber)
                ? t("SadadBillPayments.EnterAccountNoScreen.textInput.errorText")
                : undefined
            }
          />
          <Button disabled={!numericRegExp.test(accountNumber)} onPress={handleOnSubmit}>
            <Typography.Text
              color={!numericRegExp.test(accountNumber) ? "neutralBase-20" : "neutralBase-60"}
              size="body"
              weight="medium">
              {t("SadadBillPayments.EnterAccountNoScreen.continueText")}
            </Typography.Text>
          </Button>
        </View>
        <NotificationModal
          onClose={() => {
            setErrorModal(false);
          }}
          message={t("SadadBillPayments.EnterAccountNoScreen.errorModal.message")}
          isVisible={errorModal}
          title={t("SadadBillPayments.EnterAccountNoScreen.errorModal.title")}
          variant="error"
          buttons={{
            primary: (
              <Button onPress={() => handleOnRetry()}>
                {t("SadadBillPayments.EnterAccountNoScreen.errorModal.buttonRetryText")}
              </Button>
            ),
          }}
        />
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
        <NotificationModal
          onClose={() => {
            navigation.goBack();
          }}
          message={t("SadadBillPayments.EnterAccountNoScreen.genericError.message")}
          isVisible={error !== null}
          title={t("SadadBillPayments.EnterAccountNoScreen.genericError.title")}
          variant="error"
        />
      </ContentContainer>
    </Page>
  );
}
