import { useEffect, useState } from "react";
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
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";

export default function EnterBillAmountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { navigationType, setBillDetails, billDetails } = useSadadBillPaymentContext();

  const [selectedCurrentBill, setSelectedCurrentBill] = useState(true);
  const [OtherBillAmountToPay, setOtherBillAmountToPay] = useState<string>("");

  useEffect(() => {
    if (billDetails.OtherBillAmount) {
      setSelectedCurrentBill(false);
      setOtherBillAmountToPay(billDetails.OtherBillAmount);
    }
  }, [billDetails.OtherBillAmount]);

  const handleLinkPress = () => {
    //TODO link press will be implemnted in upcoming story
  };

  const handleContinuePress = () => {
    setBillDetails({ ...billDetails, OtherBillAmount: selectedCurrentBill ? undefined : OtherBillAmountToPay });
    navigation.goBack();
    navigation.navigate("SadadBillPayments.BillAmountDescriptionScreen");
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
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          title={
            navigationType === "oneTimePayment"
              ? t("SadadBillPayments.EnterBillAmountScreen.oneTimePaymentTitle")
              : t("SadadBillPayments.EnterBillAmountScreen.payBillTitle")
          }
        />
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
            <Typography.Text color="neutralBase+30" weight="medium" size="title2">
              {billDetails.BillAmount}
              <Typography.Text color="neutralBase+30" weight="regular" size="callout">
                {" " + billDetails.BillAmountCurrency}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <PayBillRadioButton
            label={t("SadadBillPayments.EnterBillAmountScreen.otherAmount")}
            isSelected={!selectedCurrentBill}
            onPress={() => (billDetails.ExactPaymentRequired ? null : setSelectedCurrentBill(false))}
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
              Number(OtherBillAmountToPay) > Number(billDetails.BillAmount ?? 0) * 2
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
              onPress={() => handleContinuePress()}
              variant="primary"
              disabled={
                (!selectedCurrentBill || billDetails.BillAmount <= 0) &&
                (Number(OtherBillAmountToPay) > billDetails.BillAmount * 2 || OtherBillAmountToPay.length < 1)
              }>
              {t("SadadBillPayments.EnterBillAmountScreen.continue")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
