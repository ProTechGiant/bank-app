import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { AmountInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { InlineBanner } from "@/features/CardActions/components";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useTransferLimitAmount } from "@/hooks/use-transfer-limit";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatCurrency } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { TransferLimitsModal } from "../components";
import { isLimitReached } from "../utils";

interface QuickTransferInput {
  PaymentAmount: number;
}

export default function QuickTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.QuickTransferScreen">>();

  const isActiveUser = route.params?.isActiveUser ?? false;

  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;
  const { setTransferType, setTransferAmount, beneficiary } = useInternalTransferContext();
  const { data: transferLimitData, isError: transferLimitError } = useTransferLimitAmount(
    TransferType.IpsTransferAction
  );
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);

  useEffect(() => {
    setIsGenericErrorModalVisible(account.isError);
  }, [account.isError]);

  useEffect(() => {
    setIsGenericErrorModalVisible(transferLimitError);
  }, [transferLimitError]);

  const { control, handleSubmit, watch } = useForm<QuickTransferInput>({
    defaultValues: {
      PaymentAmount: route.params?.PaymentAmount ?? 0,
    },
  });

  const handleOnContinue = (values: QuickTransferInput) => {
    setTransferAmount(values.PaymentAmount);
    values.PaymentAmount > SARIE_TRANSFER_CHECK_LIMIT
      ? setTransferType(TransferType.SarieTransferAction)
      : setTransferType(TransferType.IpsTransferAction);

    if (values.PaymentAmount <= PROXY_TRANFER_CHECK_LIMIT) {
      if (isActiveUser) {
        navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
          PaymentAmount: values.PaymentAmount,
          ReasonCode: "",
          Beneficiary: {
            FullName: beneficiary.FullName ?? "",
            IBAN: beneficiary.IBAN ?? "",
            type: beneficiary.BeneficiaryType,
            beneficiaryId: beneficiary.beneficiaryId ?? "",
            Bank: {
              EnglishName: beneficiary.BankName ?? "",
              ArabicName: beneficiary.BankArabicName ?? "",
              BankCode: "",
              BankId: "",
              BankShortName: "",
            },
          },
        });
      } else navigation.navigate("InternalTransfers.EnterLocalTransferBeneficiaryScreen");
    } else {
      navigation.navigate("InternalTransfers.BeneficiaryListsWithSearchForTransfersScreen");
    }
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

  const transferDeliveryBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    borderRadius: theme.radii.medium,
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const currentAmount = watch("PaymentAmount");
  const amountExceedsBalance = currentAmount > currentBalance;

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.QuickTransferScreen.navTitle")}
          testID="InternalTransfers.QuickTransferScreen:NavHeader"
        />
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        {undefined !== currentBalance ? (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
            <ContentContainer>
              <View style={styles.container}>
                <View style={amountContainerStyle}>
                  <AmountInput
                    autoFocus
                    control={control}
                    currentBalance={currentBalance}
                    isError={amountExceedsBalance}
                    maxLength={10}
                    name="PaymentAmount"
                    testID="InternalTransfers.QuickTransferScreen:TransferAmountInput"
                    inputColor="neutralBase+30"
                    title={t("InternalTransfers.InternalTransferScreen.enterAmount")}
                    accountType={t("InternalTransfers.InternalTransferScreen.accountType")}
                    accountNumber={account.data?.accountNumber}
                  />
                  <Stack direction="horizontal">
                    <Typography.Text
                      color={isLimitReached(currentAmount, transferLimitData) ? "errorBase" : "neutralBase-10"}
                      style={amountContainerStyle}>
                      {t("InternalTransfers.TransferLimitsModal.minimumAvailableTransfer")}
                    </Typography.Text>
                    <View style={transferLimitContainerStyle}>
                      <RightIconLink
                        onPress={handleOnTransferLimitsPress}
                        icon={<InfoCircleIcon />}
                        textSize="body"
                        testID="InternalTransfers.QuickTransferScreen:TransferLimitsButton"
                        iconColor="neutralBase+30"
                        linkColor={isLimitReached(currentAmount, transferLimitData) ? "errorBase" : "neutralBase+30"}>
                        {formatCurrency(
                          transferLimitData?.AvailableProductLimit ?? 0,
                          t("InternalTransfers.TransferAmountInput.currency")
                        )}
                      </RightIconLink>
                    </View>
                  </Stack>
                  <InlineBanner
                    style={transferDeliveryBannerStyle}
                    icon={<InfoCircleIcon color={infoIconColor} />}
                    text={
                      currentAmount > TRANSFER_DELIVERY_SAME_DAY_CAP
                        ? t("InternalTransfers.InternalTransferScreen.transferDeliveryNextDay")
                        : t("InternalTransfers.InternalTransferScreen.transferDeliverySameDay")
                    }
                    testID="InternalTransfers.InternalTransferScreen:TransferDeliveryBanner"
                    variant="info"
                  />
                </View>
              </View>
              <Button
                testID="InternalTransfers.QuickTransferScreen:ContinueButton"
                disabled={
                  amountExceedsBalance || isLimitReached(currentAmount, transferLimitData) || currentAmount < 0.01
                }
                onPress={handleSubmit(handleOnContinue)}>
                {t("InternalTransfers.QuickTransferScreen.continueButton")}
              </Button>
            </ContentContainer>
          </KeyboardAvoidingView>
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <TransferLimitsModal
        onClose={() => setIsTransferLimitsModalVisible(false)}
        isVisible={isTransferLimitsModalVisible}
        testID="InternalTransfers.QuickTransferScreen:TransferLimitModal"
        limitData={transferLimitData}
        isError={isLimitReached(currentAmount, transferLimitData)}
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
const TRANSFER_DELIVERY_SAME_DAY_CAP = 20000;
const PROXY_TRANFER_CHECK_LIMIT = 2500;
const SARIE_TRANSFER_CHECK_LIMIT = 20000;
