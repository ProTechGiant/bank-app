import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { IconLink } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { QuickTransferLimitsModal, TransferAmountInput, TransferErrorBox, TransferReasonInput } from "../components";
import { useTransferReasons } from "../hooks/query-hooks";

interface QuickTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
}

export default function QuickTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "InternalTransfers.QuickTransferScreen">>();

  const reasons = useTransferReasons();
  const account = useAccount();
  const currentBalance = account.data?.currentAccountBalance ?? 0;

  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);
  const [isTransferReasonsErrorVisible, setIsTransferReasonsErrorVisible] = useState(false);

  useEffect(() => {
    setIsGenericErrorModalVisible(account.isError);
  }, [account.isError]);

  useEffect(() => {
    setIsTransferReasonsErrorVisible(reasons.isError);
  }, [reasons.isError]);

  const { control, handleSubmit, watch, getValues } = useForm<QuickTransferInput>({
    defaultValues: {
      PaymentAmount: route.params?.PaymentAmount ?? 0,
      ReasonCode: route.params?.ReasonCode,
    },
  });

  const handleOnContinue = (values: QuickTransferInput) => {
    navigation.navigate("InternalTransfers.EnterQuickTransferBeneficiaryScreen", {
      ...values,
    });
  };

  const handleOnTransferLimitsPress = () => {
    setIsTransferLimitsModalVisible(true);
  };

  const handleOnSwitchStandardTransferPress = () => {
    setIsTransferLimitsModalVisible(false);

    setTimeout(() => {
      navigation.navigate("InternalTransfers.StandardTransferScreen", {
        ...getValues(),
      });
    }, 300);
  };

  const handleOnAddFundsPress = () => {
    navigation.navigate("AddMoney.AddMoneyStack", {
      screen: "AddMoney.AddMoneyInfoScreen",
    });
  };

  const limitsContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const amountContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  // !TODO (AC8): daily limit check
  const amountExceedsDailyLimit = false;
  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;
  const amountExceedsLimit = currentAmount > QUICK_TRANSFER_LIMIT;

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader />
        {undefined !== currentBalance ? (
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.QuickTransferScreen.title")}
              </Typography.Text>
              <View style={limitsContainerStyle}>
                <IconLink onPress={handleOnTransferLimitsPress} icon={<InfoCircleIcon />} textSize="footnote">
                  {t("InternalTransfers.QuickTransferScreen.transferLimits")}
                </IconLink>
              </View>
              <View style={amountContainerStyle}>
                <TransferAmountInput
                  autoFocus
                  control={control}
                  currentBalance={currentBalance}
                  isError={amountExceedsLimit || amountExceedsBalance}
                  maxLength={10}
                  name="PaymentAmount"
                />
                {amountExceedsDailyLimit ? (
                  <TransferErrorBox textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsDailyLimit")} />
                ) : amountExceedsBalance ? (
                  <TransferErrorBox
                    onPress={handleOnAddFundsPress}
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.QuickTransferScreen.addFunds")}
                  />
                ) : amountExceedsLimit ? (
                  <TransferErrorBox
                    onPress={handleOnSwitchStandardTransferPress}
                    // eslint-disable-next-line prettier/prettier
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsQuickTransferLimit", { amount: formatter.format(QUICK_TRANSFER_LIMIT) })}
                    textEnd={t("InternalTransfers.QuickTransferScreen.switchToStandardTransfer")}
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
              disabled={amountExceedsBalance || amountExceedsLimit || currentAmount < 0.01}
              onPress={handleSubmit(handleOnContinue)}>
              {t("InternalTransfers.QuickTransferScreen.continueButton")}
            </Button>
          </ContentContainer>
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <QuickTransferLimitsModal
        onClose={() => setIsTransferLimitsModalVisible(false)}
        onSwitchStandardTransferPress={handleOnSwitchStandardTransferPress}
        isVisible={isTransferLimitsModalVisible}
      />
      <NotificationModal
        onClose={() => {
          setIsTransferReasonsErrorVisible(false);
          setTimeout(() => navigation.goBack(), 300);
        }}
        message={t("InternalTransfers.QuickTransferScreen.couldNotLoadReasonsErrorMessage")}
        title={t("InternalTransfers.QuickTransferScreen.couldNotLoadReasonsErrorTitle")}
        variant="error"
        isVisible={isTransferReasonsErrorVisible}
      />
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

const QUICK_TRANSFER_LIMIT = 2500;
const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 0 });
