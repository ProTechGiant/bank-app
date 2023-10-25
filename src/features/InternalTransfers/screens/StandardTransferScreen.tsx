import { RouteProp, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CalendarAltIcon, InfoCircleIcon, InfoFilledCircleIcon } from "@/assets/icons";
import { RightIconLink, TransferErrorBox } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useTransferLimitAmount } from "@/hooks/use-transfer-limit";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import delayTransition from "@/utils/delay-transition";

import { TransferAmountInput, TransferLimitError, TransferReasonInput } from "../components";
import TransferLimitsModal from "../components/TransferLimitsModal";
import WarningBanner from "../components/WarningBanner";
import { useDailyLimitValidation, useTransferReasons } from "../hooks/query-hooks";
import { TransferTypeCode } from "../types";

interface StandardTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  phoneNumber: string;
  type: string;
}

export default function StandardTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.StandardTransferScreen">>();

  const reasons = useTransferReasons(TransferType.IpsTransferAction);
  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;
  const dailyLimitAsync = useDailyLimitValidation();

  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsErrorVisible, setIsTransferLimitsErrorVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);
  const [isTransferReasonsErrorVisible, setIsTransferReasonsErrorVisible] = useState(false);

  const { setReason, setTransferAmount, setTransferType } = useInternalTransferContext();

  const { transferLimitAmount } = useTransferLimitAmount(String(account?.data?.id));
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

  const { control, handleSubmit, watch, getValues } = useForm<StandardTransferInput>({
    defaultValues: {
      PaymentAmount: route.params?.PaymentAmount ?? 0,
      ReasonCode: route.params?.ReasonCode,
    },
  });

  const handleOnContinue = (values: StandardTransferInput) => {
    const defaultReason = reasons?.data?.TransferReason[0]?.Code;
    const selectedReason = values.ReasonCode ?? defaultReason;

    if (selectedReason === undefined) {
      return;
    }

    setTransferAmount(values.PaymentAmount);
    setReason(selectedReason);
    setTransferType(TransferType.SarieTransferAction);

    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };

  const handleOnTransferLimitsPress = () => {
    setIsTransferLimitsModalVisible(true);
  };

  const handleOnSwitchStandardTransferPress = () => {
    setIsTransferLimitsModalVisible(false);

    delayTransition(() => {
      navigation.navigate("InternalTransfers.QuickTransferScreen", {
        ...getValues(),
      });
    });
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

  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;

  const amountExceedsLimit = currentAmount > transferLimitAmount;
  const debouncedFunc = useCallback(debounce(handleOnValidateDailyLimit, 300), []);

  useEffect(() => {
    debouncedFunc(currentAmount);
  }, [currentAmount]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.StandardTransferScreen.navTitle")}
          testID="InternalTransfers.StandardTransferScreen:NavHeader"
        />
        {undefined !== currentBalance ? (
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.StandardTransferScreen.title")}
              </Typography.Text>
              <View style={limitsContainerStyle}>
                <RightIconLink
                  onPress={handleOnTransferLimitsPress}
                  icon={<InfoCircleIcon />}
                  textSize="footnote"
                  testID="InternalTransfers.StandardTransferScreen:TransferLimitsButton">
                  {t("InternalTransfers.StandardTransferScreen.transferLimits")}
                </RightIconLink>
              </View>
              <View style={amountContainerStyle}>
                <TransferAmountInput
                  autoFocus
                  control={control}
                  currentBalance={currentBalance}
                  isError={
                    (amountExceedsBalance || amountExceedsLimit || dailyLimitAsync.data?.IsLimitExceeded) ?? false
                  }
                  hideBalanceError={!amountExceedsBalance}
                  maxLength={10}
                  name="PaymentAmount"
                  testID="InternalTransfers.StandardTransferScreen:TransferAmountInput"
                />
                {dailyLimitAsync.data?.IsLimitExceeded ? (
                  <TransferErrorBox
                    testID="InternalTransfers.StandardTransferScreen:LimitExceededErrorBox"
                    textStart={t("InternalTransfers.StandardTransferScreen.amountExceedsDailyLimit", {
                      limit: dailyLimitAsync.data?.DailyLimit,
                      amount: dailyLimitAsync.data?.ExceededAmount,
                    })}
                  />
                ) : amountExceedsBalance ? (
                  <TransferErrorBox
                    onPress={handleOnAddFundsPress}
                    testID="InternalTransfers.StandardTransferScreen:BalanceExceededErrorBox"
                    textStart={t("InternalTransfers.StandardTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.StandardTransferScreen.addFunds")}
                  />
                ) : amountExceedsLimit ? (
                  <TransferLimitError
                    testID="InternalTransfers.StandardTransferScreen:AmountExceededErrorBox"
                    textStart={t("InternalTransfers.InternalTransferScreen.amountExceedsLimit")}
                    textEnd={t("InternalTransfers.InternalTransferScreen.upgradeYourTierPlus")}
                    // TODO: onPress navigate to screen where signature card can be upgraded (PC-14920, AC-3)
                  />
                ) : null}
                <TransferReasonInput
                  isLoading={reasons.isLoading}
                  reasons={reasons.data?.TransferReason ?? []}
                  control={control}
                  name="ReasonCode"
                  testID="InternalTransfers.StandardTransferScreen:TransferReasonInput"
                />
                <WarningBanner
                  icon={<InfoFilledCircleIcon />}
                  text={
                    amountExceedsLimit
                      ? t("InternalTransfers.StandardTransferScreen.nonOperativeHoursWarning")
                      : t("InternalTransfers.StandardTransferScreen.amountSentInstantlyMessage")
                  }
                />
              </View>
            </View>
            <Stack direction="horizontal" gap="12p" justify="space-between">
              <View style={styles.button}>
                <Button
                  color="light"
                  disabled={amountExceedsBalance || dailyLimitAsync.data?.IsLimitExceeded}
                  variant="secondary"
                  iconLeft={<CalendarAltIcon />}
                  testID="InternalTransfers.StandardTransferScreen:ScheduleButton">
                  {t("InternalTransfers.StandardTransferScreen.scheduleButton")}
                </Button>
              </View>
              <View style={styles.button}>
                <Button
                  variant="primary"
                  color="light"
                  disabled={amountExceedsBalance || dailyLimitAsync.data?.IsLimitExceeded}
                  onPress={handleSubmit(handleOnContinue)}
                  testID="InternalTransfers.StandardTransferScreen:ContinueButton">
                  {t("InternalTransfers.StandardTransferScreen.continueButton")}
                </Button>
              </View>
            </Stack>
          </ContentContainer>
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <TransferLimitsModal
        onClose={() => setIsTransferLimitsModalVisible(false)}
        onSwitchStandardTransferPress={handleOnSwitchStandardTransferPress}
        isVisible={isTransferLimitsModalVisible}
        transferType={TransferTypeCode.LocalTransferSarie}
      />
      <NotificationModal
        onClose={() => {
          setIsTransferReasonsErrorVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        message={t("InternalTransfers.StandardTransferScreen.couldNotLoadReasonsErrorMessage")}
        title={t("InternalTransfers.StandardTransferScreen.couldNotLoadReasonsErrorTitle")}
        variant="error"
        isVisible={isTransferReasonsErrorVisible}
      />
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
      <NotificationModal
        onClose={() => {
          setIsTransferLimitsErrorVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        title={t("InternalTransfers.StandardTransferScreen.limitError.title")}
        message={t("InternalTransfers.StandardTransferScreen.limitError.message")}
        isVisible={isTransferLimitsErrorVisible}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
});
