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

export default function EnterAccountNoScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, setBillDetails } = useSadadBillPaymentContext();

  const [accountNumber, setAccountNumber] = useState<string>("");

  const handleOnSubmit = () => {
    setBillDetails({ ...billDetails, accountNumber });
    navigation.navigate("SadadBillPayments.EnterBillDescScreen");
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
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        title={t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")}
        subTitle={billDetails.billIssuer}
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
            <Typography.Text
              color={accountNumber.length < 11 ? "neutralBase-20" : "neutralBase-60"}
              size="body"
              weight="medium">
              {t("SadadBillPayments.EnterAccountNoScreen.continueText")}
            </Typography.Text>
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}
