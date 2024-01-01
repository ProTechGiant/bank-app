import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, Stack, TransferErrorBox } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { AmountInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useTransferLimitAmount } from "@/hooks/use-transfer-limit";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { TransferLimitError, TransferLimitsModal } from "../components";
import { useTransferReasons } from "../hooks/query-hooks";

interface InternalTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
}

export default function InternalTransferScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.InternalTransferScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const account = useCurrentAccount();

  const { setTransferAmount, setReason, transferType } = useInternalTransferContext();

  const triggerResetForm = route.params?.ResetForm ?? false;

  // BeneficiaryType is required in order to fetch the list of transfer reasons
  if (transferType === undefined) {
    throw new Error('Cannot access InternalTransferScreen without "transferType"');
  }
  const reasons = useTransferReasons(transferType);

  const { data: transferLimitData } = useTransferLimitAmount(transferType);

  const currentBalance = account.data?.balance ?? 0;
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm<InternalTransferInput>({
    mode: "onChange",
    defaultValues: {
      PaymentAmount: 0,
      ReasonCode: undefined,
    },
  });

  useEffect(() => {
    if (triggerResetForm) {
      reset();
    }
  }, [triggerResetForm, reset]);

  const handleOnNextPress = (values: InternalTransferInput) => {
    // this was added to fix missing callback warning when we are somehow unable to fetch TransferReason.
    if (reasons.data?.TransferReason === undefined) return;

    // this added to make default selection to reasons.
    const defaultReason = reasons.data.TransferReason[0]?.Code;
    const selectedReason = values.ReasonCode ?? defaultReason;

    if (selectedReason === undefined) {
      return;
    }

    setTransferAmount(values.PaymentAmount);
    setReason(selectedReason);
    navigation.navigate("InternalTransfers.InternalTransferCTCAndCTAScreen");
  };

  const handleOnAddFundsPress = () => {
    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };

  const handleOnTransferLimitsPress = () => {
    setIsTransferLimitsModalVisible(true);
  };

  const amountContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const transferLimitContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingStart: theme.spacing["4p"],
  }));

  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;
  const amountExceedsLimit = currentAmount > (transferLimitData?.AvailableProductLimit ?? 0);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <NavHeader
          title={t("InternalTransfers.InternalTransferScreen.title")}
          testID="InternalTransfers.InternalTransferScreen:NavHeader"
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <View style={amountContainerStyle}>
                <AmountInput
                  autoFocus
                  control={control}
                  currentBalance={currentBalance}
                  isError={amountExceedsBalance || amountExceedsLimit}
                  maxLength={10}
                  name="PaymentAmount"
                  testID="InternalTransfers.InternalTransferScreen:TransferAmountInput"
                  inputColor="neutralBase+30"
                  title={t("InternalTransfers.InternalTransferScreen.enterAmount")}
                />
                {amountExceedsBalance ? (
                  <TransferErrorBox
                    testID="InternalTransfers.InternalTransferScreen:BalanceExceededErrorBox"
                    onPress={handleOnAddFundsPress}
                    textStart={t("InternalTransfers.InternalTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.InternalTransferScreen.addFunds")}
                  />
                ) : amountExceedsLimit ? (
                  <TransferLimitError
                    testID="InternalTransfers.InternalTransferScreen:AmountExceededErrorBox"
                    textStart={t("InternalTransfers.InternalTransferScreen.amountExceedsLimit")}
                    textEnd={t("InternalTransfers.InternalTransferScreen.upgradeYourTierPlus")}
                    // TODO: onPress navigate to screen where signature card can be upgraded (PC-14917, AC-3)
                  />
                ) : null}
                <Stack direction="horizontal">
                  <Typography.Text color="neutralBase-10" style={amountContainerStyle}>
                    {t("InternalTransfers.InternalTransferScreen.availableDailyLimit")}
                  </Typography.Text>
                  <View style={transferLimitContainerStyle}>
                    <RightIconLink
                      onPress={handleOnTransferLimitsPress}
                      icon={<InfoCircleIcon />}
                      textSize="body"
                      testID="InternalTransfers.InternalTransferScreen:TransferLimitsButton"
                      iconColor="neutralBase+30"
                      linkColor="neutralBase+30">
                      {formatCurrency(
                        transferLimitData?.AvailableProductLimit ?? 0,
                        t("InternalTransfers.TransferAmountInput.currency")
                      )}
                    </RightIconLink>
                  </View>
                </Stack>
              </View>
            </View>
            <Button
              testID="InternalTransfers.InternalTransferScreen:ContinueButton"
              //isReasonAvailable remove to make default selection to reasons.
              disabled={amountExceedsBalance || currentAmount < MINIMAL_AMOUNT || amountExceedsLimit}
              onPress={handleSubmit(handleOnNextPress)}>
              {t("InternalTransfers.InternalTransferScreen.continue")}
            </Button>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      {/* Display transfer limit modal */}
      <TransferLimitsModal
        onClose={() => setIsTransferLimitsModalVisible(false)}
        isVisible={isTransferLimitsModalVisible}
        testID="InternalTransfers.InternalTransferScreen:TransferLimitModal"
      />
      <NotificationModal
        onClose={() => {
          setIsGenericErrorModalVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isGenericErrorModalVisible}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

const MINIMAL_AMOUNT = 0.01;
