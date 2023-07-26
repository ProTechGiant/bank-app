import { RouteProp, useRoute } from "@react-navigation/native";
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

import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

export default function EnterBillDescriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [billDescription, setBillDescription] = useState<string>("");
  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.EnterBillDescScreen">>();

  const handleOnSubmit = () => {
    navigation.navigate("SadadBillPayments.BillDescriptionScreen", {
      ...route.params,
      BillDescription: billDescription,
    });
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
    <Page>
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        title={t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")}
        subTitle={route.params.biller}
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
            <Typography.Text color="neutralBase-60" size="body" weight="medium">
              {t("SadadBillPayments.EnterBillDescriptionScreen.buttonText")}
            </Typography.Text>
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}
