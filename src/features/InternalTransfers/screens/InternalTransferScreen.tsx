import { useState } from "react";
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
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { TransferAmountInput, TransferErrorBox, TransferReasonInput } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useTransferReasons } from "../hooks/query-hooks";

interface InternalTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
}

export default function InternalTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const account = useCurrentAccount();

  const { setTransferAmount, setReason, transferType } = useInternalTransferContext();

  // BeneficiaryType is required in order to fetch the list of transfer reasons
  if (transferType === undefined) {
    throw new Error('Cannot access InternalTransferScreen without "transferType"');
  }
  const reasons = useTransferReasons(transferType);

  const currentBalance = account.data?.balance ?? 0;
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const { control, handleSubmit, watch } = useForm<InternalTransferInput>({
    mode: "onChange",
    defaultValues: {
      PaymentAmount: 0,
      ReasonCode: undefined,
    },
  });

  const handleOnNextPress = (values: InternalTransferInput) => {
    setTransferAmount(values.PaymentAmount);
    setReason(values.ReasonCode);

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
    marginTop: theme.spacing["18p"],
  }));

  const isReasonAvailable = watch("ReasonCode") !== undefined;
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
              {transferType === "CROATIA_TO_ARB_TRANSFER_ACTION" ? (
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
              disabled={amountExceedsBalance || currentAmount < MINIMAL_AMOUNT || !isReasonAvailable}
              onPress={handleSubmit(handleOnNextPress)}>
              Continue
            </Button>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsGenericErrorModalVisible(false);
          setTimeout(() => navigation.goBack(), 300);
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
