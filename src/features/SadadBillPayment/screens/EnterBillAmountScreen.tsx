import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ViewStyle } from "react-native/types";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import RightIconLink from "@/components/Link/RightIconLink";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PayBillRadioButton } from "../components";

export default function EnterBillAmountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedCurrentBill, setSelectedCurrentBill] = useState(false);
  const [OtherBillAmountToPay, setOtherBillAmountToPay] = useState<string>("");

  const handleLinkPress = () => {
    //TODO link press will be implemnted in upcoming story
  };

  const limitsContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["8p"],
  }));
  const radioButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));
  const accountFormContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    marginTop: theme.spacing["24p"],
    flex: 1,
  }));
  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["24p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader title={t("SadadBillPayments.EnterBillAmountScreen.navTitle")} />
        <ContentContainer style={mainContainerStyle}>
          <Typography.Text color="neutralBase+30" weight="medium" size="title1">
            {t("SadadBillPayments.EnterBillAmountScreen.specifyBillAmount")}
          </Typography.Text>
          <Stack
            align="center"
            direction="horizontal"
            gap="4p"
            justify="space-between"
            style={radioButtonContainerStyle}>
            <PayBillRadioButton
              label={t("SadadBillPayments.EnterBillAmountScreen.currentBillAmount")}
              isSelected={selectedCurrentBill}
              onPress={() => setSelectedCurrentBill(true)}
            />
            <Typography.Text color="neutralBase+30" weight="medium" size="title1">
              {currentBillAmount}
              <Typography.Text color="neutralBase+30" weight="medium" size="title3">
                {t("Currency.sar")}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <PayBillRadioButton
            label={t("SadadBillPayments.EnterBillAmountScreen.otherAmount")}
            isSelected={!selectedCurrentBill}
            onPress={() => setSelectedCurrentBill(false)}
          />
          <SimpleTextInput
            extraStart={t("SadadBillPayments.EnterBillAmountScreen.inputExtraText")}
            label={t("SadadBillPayments.EnterBillAmountScreen.enterCustomAmount")}
            maxLength={12}
            keyboardType="number-pad"
            placeholder={t("SadadBillPayments.EnterBillAmountScreen.amountInputPlaceholder")}
            showCharacterCount={false}
            value={OtherBillAmountToPay}
            isEditable={!selectedCurrentBill}
            onChangeText={setOtherBillAmountToPay}
            errorText={
              Number(OtherBillAmountToPay) > currentBillAmount * 2
                ? t("SadadBillPayments.EnterBillAmountScreen.inputExtraText")
                : undefined
            }
          />
          <View style={accountFormContainerStyle}>
            <View style={limitsContainerStyle}>
              <RightIconLink onPress={() => handleLinkPress()} icon={<InfoCircleIcon />} textSize="footnote">
                {t("SadadBillPayments.EnterBillAmountScreen.linkText")}
              </RightIconLink>
            </View>
            <Button
              onPress={() => navigation.navigate("SadadBillPayments.BillSavedSuccessScreen")}
              variant="primary"
              disabled={
                !selectedCurrentBill &&
                (Number(OtherBillAmountToPay) > currentBillAmount * 2 || OtherBillAmountToPay.length < 1)
              }>
              {t("SadadBillPayments.EnterBillAmountScreen.continue")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
const currentBillAmount = 310;
// will be removed after Api implementation
