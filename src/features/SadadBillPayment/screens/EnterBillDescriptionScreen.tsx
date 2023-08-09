import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";

export default function EnterBillDescriptionScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, setBillDetails, navigationType } = useSadadBillPaymentContext();

  const [billDescription, setBillDescription] = useState<string>("");

  const handleOnSubmit = () => {
    setBillDetails({ ...billDetails, description: billDescription, otherBillAmount: undefined });
    navigation.navigate("SadadBillPayments.BillDescriptionScreen");
  };

  const handleOnChangeText = (text: string) => {
    setBillDescription(text);
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
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        title={
          navigationType === "oneTimePayment"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
            : t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")
        }
        subTitle={i18n.language === "en" ? billDetails.billIssuer?.NameEn : billDetails.billIssuer?.NameAr}
      />
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
          <Button disabled={billDescription.length < 1} onPress={handleOnSubmit}>
            <Typography.Text
              color={billDescription.length < 1 ? "neutralBase-20" : "neutralBase-60"}
              size="body"
              weight="medium">
              {t("SadadBillPayments.EnterBillDescriptionScreen.buttonText")}
            </Typography.Text>
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}
