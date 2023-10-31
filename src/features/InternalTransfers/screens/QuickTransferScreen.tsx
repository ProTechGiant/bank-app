import { RouteProp, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, TransferErrorBox } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { AmountInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
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

import { TransferLimitError, TransferLimitsModal, TransferReasonInput } from "../components";
import { useDailyLimitValidation, useTransferReasons } from "../hooks/query-hooks";
import { TransferTypeCode } from "../types";

interface QuickTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
}

export default function QuickTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.QuickTransferScreen">>();

  const reasons = useTransferReasons(TransferType.IpsTransferAction);
  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;
  const dailyLimitAsync = useDailyLimitValidation();
  const { transferLimitAmount } = useTransferLimitAmount(String(account?.data?.id));
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsErrorVisible, setIsTransferLimitsErrorVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);
  const [isTransferReasonsErrorVisible, setIsTransferReasonsErrorVisible] = useState(false);

  const { setTransferType, setTransferAmount, setReason } = useInternalTransferContext();

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
    const defaultReason = reasons.data?.TransferReason[0]?.Code;
    const selectedReason = values.ReasonCode ?? defaultReason;

    setReason(selectedReason);
    setTransferAmount(values.PaymentAmount);
    setTransferType(TransferType.IpsTransferAction);

    if (selectedReason === undefined) {
      return;
    }

    navigation.navigate("InternalTransfers.EnterQuickTransferBeneficiaryScreen");
  };

  const handleOnTransferLimitsPress = () => {
    setIsTransferLimitsModalVisible(true);
  };

  const handleOnSwitchStandardTransferPress = () => {
    setIsTransferLimitsModalVisible(false);

    delayTransition(() => {
      navigation.navigate("InternalTransfers.StandardTransferScreen", {
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
          testID="InternalTransfers.QuickTransferScreen:NavHeader"
        />
        {undefined !== currentBalance ? (
          <ContentContainer isScrollView>
            <View style={styles.container}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.QuickTransferScreen.title")}
              </Typography.Text>
              <View style={limitsContainerStyle}>
                <RightIconLink
                  onPress={handleOnTransferLimitsPress}
                  icon={<InfoCircleIcon />}
                  textSize="footnote"
                  testID="InternalTransfers.QuickTransferScreen:TransferLimitsButton">
                  {t("InternalTransfers.QuickTransferScreen.transferLimits")}
                </RightIconLink>
              </View>
              <View style={amountContainerStyle}>
                <AmountInput
                  autoFocus
                  control={control}
                  currentBalance={currentBalance}
                  isError={amountExceedsLimit || amountExceedsBalance}
                  maxLength={10}
                  name="PaymentAmount"
                  testID="InternalTransfers.QuickTransferScreen:TransferAmountInput"
                />
                {dailyLimitAsync.data?.IsLimitExceeded ? (
                  <TransferErrorBox
                    testID="InternalTransfers.QuickTransferScreen:LimitExceededErrorBox"
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsDailyLimit", {
                      limit: dailyLimitAsync.data?.DailyLimit,
                      amount: dailyLimitAsync.data?.ExceededAmount,
                    })}
                  />
                ) : amountExceedsBalance ? (
                  <TransferErrorBox
                    testID="InternalTransfers.QuickTransferScreen:BalanceExceededErrorBox"
                    onPress={handleOnAddFundsPress}
                    textStart={t("InternalTransfers.QuickTransferScreen.amountExceedsBalance")}
                    textEnd={t("InternalTransfers.QuickTransferScreen.addFunds")}
                  />
                ) : amountExceedsLimit ? (
                  <TransferLimitError
                    testID="InternalTransfers.QuickTransferScreen:AmountExceededErrorBox"
                    textStart={t("InternalTransfers.InternalTransferScreen.amountExceedsLimit")}
                    textEnd={t("InternalTransfers.InternalTransferScreen.upgradeYourTierPlus")}
                    // TODO: onPress navigate to screen where signature card can be upgraded (PC-14917, AC-3)
                  />
                ) : null}
                <TransferReasonInput
                  isLoading={reasons.isLoading}
                  reasons={reasons.data?.TransferReason ?? []}
                  control={control}
                  name="ReasonCode"
                  testID="InternalTransfers.QuickTransferScreen:TransferReasonInput"
                />
              </View>
            </View>
            <Button
              testID="InternalTransfers.QuickTransferScreen:ContinueButton"
              disabled={amountExceedsBalance || amountExceedsLimit || currentAmount < 0.01 || amountExceedsLimit}
              onPress={handleSubmit(handleOnContinue)}>
              {t("InternalTransfers.QuickTransferScreen.continueButton")}
            </Button>
          </ContentContainer>
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <TransferLimitsModal
        onClose={() => setIsTransferLimitsModalVisible(false)}
        onSwitchStandardTransferPress={handleOnSwitchStandardTransferPress}
        isVisible={isTransferLimitsModalVisible}
        transferType={TransferTypeCode.LocalTransferIPS}
      />
      <NotificationModal
        onClose={() => {
          setIsTransferReasonsErrorVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        message={t("InternalTransfers.QuickTransferScreen.couldNotLoadReasonsErrorMessage")}
        title={t("InternalTransfers.QuickTransferScreen.couldNotLoadReasonsErrorTitle")}
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
