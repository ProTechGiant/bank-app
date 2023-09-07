import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { IconLink } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import delayTransition from "@/utils/delay-transition";

import { TransferAmountInput, TransferErrorBox, TransferReasonInput } from "../components";
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

  const currentBalance = account.data?.balance ?? 0;
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

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

    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };

  const handleOnAddFundsPress = () => {
    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };

  const handleOnTransferLimitsPress = () => {
    //TODO: this will be implemented later on.
  };

  const amountContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  const transferLimitContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("InternalTransfers.InternalTransferScreen.title")} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("InternalTransfers.InternalTransferScreen.screenTitle")}
              </Typography.Text>
              {transferType === TransferType.CroatiaToArbTransferAction ? (
                <View style={transferLimitContainerStyle}>
                  <IconLink onPress={handleOnTransferLimitsPress} icon={<InfoCircleIcon />} textSize="footnote">
                    {t("InternalTransfers.InternalTransferScreen.transferLimit")}
                  </IconLink>
                </View>
              ) : null}
              <View style={amountContainerStyle}>
                <TransferAmountInput
                  autoFocus
                  control={control}
                  currentBalance={currentBalance}
                  isError={amountExceedsBalance}
                  maxLength={10}
                  name="PaymentAmount"
                />
                {amountExceedsBalance ? (
                  <TransferErrorBox
                    onPress={handleOnAddFundsPress}
                    textStart={t("InternalTransfers.InternalTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.InternalTransferScreen.addFunds")}
                  />
                ) : null}
                <TransferReasonInput
                  isLoading={reasons.isLoading}
                  reasons={reasons.data?.TransferReason ?? []}
                  control={control}
                  name="ReasonCode"
                />
              </View>
            </View>
            <Button
              //isReasonAvailable remove to make default selection to reasons.
              disabled={amountExceedsBalance || currentAmount < MINIMAL_AMOUNT}
              onPress={handleSubmit(handleOnNextPress)}>
              Continue
            </Button>
          </ContentContainer>
        </KeyboardAvoidingView>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

const MINIMAL_AMOUNT = 0.01;
