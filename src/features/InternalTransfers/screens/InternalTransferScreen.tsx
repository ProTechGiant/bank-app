import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
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
import { formatCurrency } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { TransferLimitsModal } from "../components";
import { getMinimumTransferLimit, isLimitReached } from "../utils";

interface InternalTransferInput {
  PaymentAmount: number;
}

export default function InternalTransferScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.InternalTransferScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const account = useCurrentAccount();

  const { setTransferAmount, transferType } = useInternalTransferContext();

  const triggerResetForm = route.params?.ResetForm ?? false;

  // BeneficiaryType is required in order to fetch the transfer limits
  if (transferType === undefined) {
    throw new Error('Cannot access InternalTransferScreen without "transferType"');
  }

  const { data: transferLimitData, isError: transferLimitError } = useTransferLimitAmount(transferType);

  const currentBalance = account.data?.balance ?? 0;
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isTransferLimitsModalVisible, setIsTransferLimitsModalVisible] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm<InternalTransferInput>({
    mode: "onChange",
    defaultValues: {
      PaymentAmount: 0,
    },
  });

  useEffect(() => {
    if (triggerResetForm) {
      reset();
    }
  }, [triggerResetForm, reset]);

  useEffect(() => {
    setIsGenericErrorModalVisible(transferLimitError);
  }, [transferLimitError]);

  const handleOnNextPress = (values: InternalTransferInput) => {
    setTransferAmount(values.PaymentAmount);
    if (route.params?.inEditPhase) {
      navigation.goBack();
    } else if (values.PaymentAmount <= PROXY_TRANFER_CHECK_LIMIT) {
      navigation.navigate("InternalTransfers.InternalTransferCTCAndCTAScreen");
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
                  isError={amountExceedsBalance || isLimitReached(currentAmount, transferLimitData)}
                  maxLength={10}
                  name="PaymentAmount"
                  testID="InternalTransfers.InternalTransferScreen:TransferAmountInput"
                  inputColor="neutralBase+30"
                  title={t("InternalTransfers.InternalTransferScreen.enterAmount")}
                  accountType={account.data?.description}
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
                      testID="InternalTransfers.InternalTransferScreen:TransferLimitsButton"
                      iconColor="neutralBase+30"
                      linkColor={isLimitReached(currentAmount, transferLimitData) ? "errorBase" : "neutralBase+30"}>
                      {formatCurrency(
                        getMinimumTransferLimit(transferLimitData),
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
              testID="InternalTransfers.InternalTransferScreen:ContinueButton"
              disabled={
                amountExceedsBalance ||
                currentAmount < MINIMAL_AMOUNT ||
                isLimitReached(currentAmount, transferLimitData)
              }
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
        limitData={transferLimitData}
        isError={isLimitReached(currentAmount, transferLimitData)}
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
const TRANSFER_DELIVERY_SAME_DAY_CAP = 20000;
const PROXY_TRANFER_CHECK_LIMIT = 2500;
