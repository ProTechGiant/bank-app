import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

export default function EditBillDescriptionModalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.EditBillDescriptionModalScreen">>();
  const [billDescription, setBillDescription] = useState(route.params.BillDescription);

  const handleOnChangeText = (text: string) => {
    setBillDescription(text);
  };

  const handleOnSave = () => {
    route.params.updateBillDescription(billDescription);
    navigation.goBack();
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
            <Button disabled={billDescription.length < 1} onPress={handleOnSave}>
              <Typography.Text color="neutralBase-60" size="body" weight="medium">
                {t("SadadBillPayments.EditBillDescriptionModalScreen.buttonText")}
              </Typography.Text>
            </Button>
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
