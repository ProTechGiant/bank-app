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

export default function EnterAccountNoScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [accountNumber, setAccountNumber] = useState<string>("");

  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.EnterAccountNoScreen">>();

  const handleOnSubmit = () => {
    navigation.navigate("SadadBillPayments.EnterBillDescScreen", {
      ...route.params,
      AccountNumber: accountNumber,
    });
  };

  const handleOnChangeText = (text: string) => {
    setAccountNumber(text);
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
            maxLength={12}
            keyboardType="number-pad"
            value={accountNumber}
            onChangeText={handleOnChangeText}
          />
          <Button disabled={accountNumber.length < 11} onPress={handleOnSubmit}>
            <Typography.Text color="neutralBase-60" size="body" weight="medium">
              {t("SadadBillPayments.EnterAccountNoScreen.continueText")}
            </Typography.Text>
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}
