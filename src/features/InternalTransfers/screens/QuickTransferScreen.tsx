import { RouteProp, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
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
import { useCurrentAccount } from "@/hooks/use-accounts";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { QuickTransferLimitsModal, TransferAmountInput, TransferErrorBox, TransferReasonInput } from "../components";
import { useDailyLimitValidation, useTransferReasons } from "../hooks/query-hooks";

interface QuickTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
}

export default function QuickTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "InternalTransfers.QuickTransferScreen">>();

  const reasons = useTransferReasons(110);
  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;
  const dailyLimitAsync = useDailyLimitValidation();

  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsErrorVisible, setIsTransferLimitsErrorVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);
  const [isTransferReasonsErrorVisible, setIsTransferReasonsErrorVisible] = useState(false);

  const handleOnValidateDailyLimit = async (transferAmount: number) => {
    try {
      await dailyLimitAsync.mutateAsync({
        TransferAmount: transferAmount,
      });
    } catch (err) {
      setIsTransferLimitsErrorVisible(true);
      warn("daily-limit", "Could not process Daily Limit: ", JSON.stringify(err));
    }
  };

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

  const hasSelectedReasonCode = watch("ReasonCode") !== undefined;
  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;
  const amountExceedsLimit = currentAmount > QUICK_TRANSFER_LIMIT;

  const debouncedFunc = useCallback(debounce(handleOnValidateDailyLimit, 300), []);

  useEffect(() => {
    debouncedFunc(currentAmount);
  }, [currentAmount]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("InternalTransfers.QuickTransferScreen.navTitle")} />
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
                {dailyLimitAsync.data?.IsLimitExceeded ? (
                  <TransferErrorBox
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsDailyLimit", {
                      limit: dailyLimitAsync.data?.DailyLimit,
                      amount: dailyLimitAsync.data?.ExceededAmount,
                    })}
                  />
                ) : amountExceedsBalance ? (
                  <TransferErrorBox
                    onPress={handleOnAddFundsPress}
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.QuickTransferScreen.addFunds")}
                  />
                ) : amountExceedsLimit ? (
                  <TransferErrorBox
                    onPress={handleOnSwitchStandardTransferPress}
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsQuickTransferLimit", {
                      amount: formatCurrency(QUICK_TRANSFER_LIMIT, "SAR"),
                    })}
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
              disabled={amountExceedsBalance || amountExceedsLimit || currentAmount < 0.01 || !hasSelectedReasonCode}
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
      <NotificationModal
        onClose={() => {
          setIsTransferLimitsErrorVisible(false);
          setTimeout(() => navigation.goBack(), 300);
        }}
        title={t("InternalTransfers.QuickTransferScreen.limitError.title")}
        message={t("InternalTransfers.QuickTransferScreen.limitError.message")}
        isVisible={isTransferLimitsErrorVisible}
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
