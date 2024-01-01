import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View } from "react-native";

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
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatCurrency } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { TransferLimitError, TransferLimitsModal, TransferReasonInput } from "../components";
import { useTransferReasons } from "../hooks/query-hooks";

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
  const { setTransferType, setTransferAmount, setReason } = useInternalTransferContext();
  const { data: transferLimitData } = useTransferLimitAmount(TransferType.IpsTransferAction);
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
    const defaultReason = reasons.data?.TransferReason[0]?.Code;
    const selectedReason = values.ReasonCode ?? defaultReason;

    setReason(selectedReason);
    setTransferAmount(values.PaymentAmount);
    setTransferType(TransferType.IpsTransferAction);

    if (selectedReason === undefined) {
      return;
    }

    navigation.navigate("InternalTransfers.EnterLocalTransferBeneficiaryScreen");
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

  const amountExceedsAvailableLimit = currentAmount > (transferLimitData?.AvailableProductLimit ?? 0);
  const amountExceedsLimit = currentAmount > QUICK_TRANSFER_LIMIT;

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.StandardTransferScreen.navTitle")}
          testID="InternalTransfers.QuickTransferScreen:NavHeader"
        />
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
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
                {amountExceedsBalance ? (
                  <TransferErrorBox
                    testID="InternalTransfers.QuickTransferScreen:BalanceExceededErrorBox"
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
                ) : amountExceedsAvailableLimit ? (
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
              disabled={
                amountExceedsBalance || amountExceedsAvailableLimit || currentAmount < 0.01 || amountExceedsLimit
              }
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
        isVisible={isTransferLimitsModalVisible}
        testID="InternalTransfers.QuickTransferScreen:TransferLimitModal"
      />
      <NotificationModal
        testID="InternalTransfers.QuickTransferScreen:NotLoadReasonModal"
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
        testID="InternalTransfers.QuickTransferScreen:TryAgainLaterModal"
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
const QUICK_TRANSFER_LIMIT = 2500;
