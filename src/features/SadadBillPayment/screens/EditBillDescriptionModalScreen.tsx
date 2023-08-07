import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useUpdateBillDescription } from "../hooks/query-hooks";

export default function EditBillDescriptionModalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const updateBill = useUpdateBillDescription();

  const { billDetails, setBillDetails } = useSadadBillPaymentContext();

  const [billDescription, setBillDescription] = useState(billDetails.description);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const handleOnChangeText = (text: string) => {
    setBillDescription(text);
  };

  const handleOnSave = () => {
    handleOnUpdateBillDescription();
  };

  const handleOnUpdateBillDescription = async () => {
    try {
      await updateBill.mutateAsync({
        //This BillID field will be set in context from the other flows once the Payment Dues API is ready.
        //In order to test this flow with API we need to harcode biller ID as "8e2cc876" and use 0000001890 as the userID
        BillId: billDetails.billID,
        BillDescriptionEn: billDescription,
      });

      setBillDetails({ ...billDetails, description: billDescription });
      navigation.goBack();
    } catch (error) {
      setIsGenericErrorModalVisible(true);
    }
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
    <SafeAreaProvider>
      <Page>
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer style={mainContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {t("SadadBillPayments.EnterBillDescriptionScreen.enterBillDescTitle")}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase+10" weight="regular">
            {t("SadadBillPayments.EnterBillDescriptionScreen.enterBillDescSubTitle")}
          </Typography.Text>
          <View style={accountFormContainerStyle}>
            <SimpleTextInput
              showCharacterCount
              extraStart={t("SadadBillPayments.EnterBillDescriptionScreen.textInput.validationText")}
              label={t("SadadBillPayments.EnterBillDescriptionScreen.textInput.label")}
              maxLength={22}
              value={billDescription}
              onChangeText={handleOnChangeText}
            />
            <Button disabled={billDescription === undefined || billDescription?.length < 1} onPress={handleOnSave}>
              <Typography.Text color="neutralBase-60" size="body" weight="medium">
                {t("SadadBillPayments.EditBillDescriptionModalScreen.buttonText")}
              </Typography.Text>
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsGenericErrorModalVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorModalVisible}
        variant="error"
      />
    </SafeAreaProvider>
  );
}
