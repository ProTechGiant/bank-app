import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
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

  const account = useAccount();
  const reasons = useTransferReasons();
  const { setTransferAmount, setReason } = useInternalTransferContext();

  const currentBalance = account.data?.currentAccountBalance ?? 0;
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

  const amountContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("InternalTransfers.InternalTransferScreen.title")}
              </Typography.Text>
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
            <Button disabled={amountExceedsBalance || currentAmount < 0.01} onPress={handleSubmit(handleOnNextPress)}>
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
