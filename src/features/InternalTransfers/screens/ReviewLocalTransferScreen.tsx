import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import delayTransition from "@/utils/delay-transition";

import { ReviewTransferDetail } from "../components";
import { useLocalTransferForIPS, useLocalTransferForSarie, useTransferFees } from "../hooks/query-hooks";
import { BeneficiaryIdType, LocalTransfer } from "../types";

export default function ReviewQuickTransferScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ReviewLocalTransferScreen">>();

  const { transferType, transferAmount, reason } = useInternalTransferContext();
  const account = useCurrentAccount();
  const transferFeesAsync = useTransferFees(transferType);

  const { mutateAsync: localTransferForSarieAsync, isLoading: localTransferForSarieLoading } =
    useLocalTransferForSarie();
  const { mutateAsync: localTransferForIPSAsync, isLoading: localTransferForIPSLoading } = useLocalTransferForIPS();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const otpFlow = useOtpFlow();
  const signOutUser = useLogout();

  const [note, setNote] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isErrorTransferLimit, setIsErrorTransferLimit] = useState(false);
  const [isSenderTransferRejected, setSenderTransferRejected] = useState(false);
  const [isReceiverTransferRejected, setReceiverTransferRejected] = useState(false);
  const [isSASCheckStatus, setSASCheckStatus] = useState(false);
  const [isDuplicateTransfer, setIsDuplicateTransfer] = useState(false);

  interface ErrorType {
    errorContent: {
      Errors: Array<{
        ErrorId: string;
      }>;
    };
  }

  useEffect(() => {
    setIsGenericErrorModalVisible(transferFeesAsync.isError);
  }, [transferFeesAsync]);

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const handleError = (error: ErrorType) => {
    if (error?.errorContent?.Errors[0]?.ErrorId) {
      const errorCode = error.errorContent.Errors[0]?.ErrorId;
      if (errorCode === "0106") {
        delayTransition(() => {
          setSenderTransferRejected(true);
        });
      } else if (errorCode === "0107") {
        delayTransition(() => {
          setReceiverTransferRejected(true);
        });
      } else if (errorCode === "0001") {
        delayTransition(() => {
          setSASCheckStatus(true);
        });
      } else if (errorCode === "0127") {
        delayTransition(() => {
          setIsDuplicateTransfer(true);
        });
      } else {
        delayTransition(() => {
          setIsErrorModalVisible(true);
        });
      }
    } else {
      delayTransition(() => {
        setIsErrorModalVisible(true);
      });
    }
  };

  const handleFocalCheck = async () => {
    if (
      account.data === undefined ||
      transferFeesAsync.data?.TransferFee === undefined ||
      transferAmount === undefined
    ) {
      return;
    }

    const localTransferRequest: LocalTransfer = {
      transferAmount: transferAmount,
      transferAmountCurrency: "SAR",
      remitterIBAN: account.data.iban ?? "",
      remitterName: account.data.owner ?? "",
      beneficiaryIBAN: route.params.Beneficiary.IBAN,
      beneficiaryName: route.params.Beneficiary.FullName,
      clientTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      expressTransferFlag: transferType === "SARIE_TRANSFER_ACTION" ? "N" : "Y",
      transferPurpose: reason ?? "",
      transferType: "04",
      customerRemarks: note,
    };

    localTransferRequest[
      transferType === TransferType.IpsTransferAction
        ? route.params.selectionType === "ips_local_Beneficiary" || transferAmount > SARIE_TRANSFER_CHECK_LIMIT
          ? BeneficiaryIdType.BeneficiaryId
          : BeneficiaryIdType.AdhocBeneficiaryId
        : BeneficiaryIdType.BeneficiaryId
    ] = route.params.Beneficiary.beneficiaryId;

    try {
      let otpResult = null;
      if (transferType === TransferType.SarieTransferAction) {
        otpResult = await localTransferForSarieAsync(localTransferRequest);
      } else {
        otpResult = await localTransferForIPSAsync(localTransferRequest);
      }

      handleSendMoney(localTransferRequest, otpResult.OtpId);
    } catch (error: any) {
      delayTransition(() => handleError(error));
    }
  };

  const handleAddNote = (noteContent: string) => {
    setNote(noteContent);
  };

  const handleSendMoney = async (localTransferRequest: LocalTransfer, otpId: string) => {
    try {
      otpFlow.handle({
        action: {
          to: "InternalTransfers.ReviewLocalTransferScreen",
          params: route.params,
        },
        otpOptionalParams: {
          isOtpAlreadySent: true,
        },
        otpChallengeParams: {
          OtpId: otpId,
        },
        otpVerifyMethod: transferType === "SARIE_TRANSFER_ACTION" ? "sarie" : "ips-payment",
        onOtpRequest: () => {
          return transferType === "SARIE_TRANSFER_ACTION"
            ? localTransferForSarieAsync(localTransferRequest)
            : localTransferForIPSAsync(localTransferRequest);
        },
        onFinish: (status, _payload, errorId) => {
          if (errorId === "0125") {
            delayTransition(() => {
              setIsErrorTransferLimit(true);
            });
          }

          if (status === "cancel") {
            return;
          }

          if (status === "fail") {
            if (transferType === TransferType.SarieTransferAction) {
              setIsGenericErrorModalVisible(false);
            } else {
              delayTransition(() => setIsErrorModalVisible(true));
            }
          } else {
            const params = {
              transferAmount: route.params.PaymentAmount,
              beneficiaryName: route.params.Beneficiary.FullName,
              clientTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            };
            navigation.navigate("InternalTransfers.LocalTransferSuccessScreen", params);
          }
        },
      });
    } catch (error) {
      delayTransition(() => {
        setIsErrorModalVisible(true);
      });
      warn("local-transfer", "Could not request OTP: ", JSON.stringify(error));
    }
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const handleOnContinue = () => {
    setIsVisible(false);
  };

  const handleOnDone = () => {
    setIsGenericErrorModalVisible(false);
    setIsErrorModalVisible(false);
    setIsErrorTransferLimit(false);
    setSenderTransferRejected(false);
    setReceiverTransferRejected(false);
    setSASCheckStatus(false);
    setIsDuplicateTransfer(false);
    
    navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const handleOnLogout = async () => {
    try {
      const authentication = await getAuthenticationToken();

      await signOutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
      setSenderTransferRejected(false);
      delayTransition(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Onboarding.OnboardingStack",
              params: {
                screen: "Onboarding.SplashScreen",
              },
            },
          ],
        });
      });
    } catch (error) {
      setSenderTransferRejected(false);
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          withBackButton
          title={t("InternalTransfers.ReviewTransferScreen.navTitle")}
          testID="InternalTransfers.ReviewLocalTransferScreen:NavHeader"
        />
        <ContentContainer isScrollView>
          <ReviewTransferDetail
            handleAddNote={handleAddNote}
            isLocalTransfer
            showSarieImage={route.params.PaymentAmount <= 20000 ? true : false}
            sender={{ accountName: account.data?.owner, accountNumber: account.data?.iban }}
            recipient={{ accountName: route.params.Beneficiary.FullName, accountNumber: route.params.Beneficiary.IBAN }}
            VAT={transferFeesAsync.data?.VatFee || "0"}
            bankName={
              i18n.language === "en"
                ? route.params.Beneficiary?.Bank?.EnglishName
                : route.params.Beneficiary?.Bank?.ArabicName
            }
            feeInc={transferFeesAsync.data?.TransferFee || "0"}
            amount={transferAmount}
          />
          <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
            <Button
              onPress={() => handleFocalCheck()}
              variant="primary"
              testID="InternalTransfers.ReviewLocalTransferScreen:SubmitButton"
              loading={localTransferForIPSLoading || localTransferForSarieLoading}
              disabled={localTransferForIPSLoading || localTransferForSarieLoading}>
              {t("InternalTransfers.ReviewTransferDetailScreen.sendMoney")}
            </Button>
            <Button
              onPress={() => handleOnClose()}
              variant="tertiary"
              testID="InternalTransfers.ReviewLocalTransferScreen:CancelButton">
              {t("InternalTransfers.ReviewTransferDetailScreen.cancel")}
            </Button>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        testID="InternalTransfers.ReviewLocalTransferScreen:ErrorModal"
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnCancel} testID="InternalTransfers.ReviewLocalTransferScreen:ConfirmCancelButton">
              {t("InternalTransfers.ReviewTransferDetailScreen.notification.cancel")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnContinue} testID="InternalTransfers.ReviewLocalTransferScreen:CancelCancelButton">
              {t("InternalTransfers.ReviewTransferDetailScreen.notification.continue")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.ReviewTransferDetailScreen.notification.message")}
        title={t("InternalTransfers.ReviewTransferDetailScreen.notification.title")}
        isVisible={isVisible}
      />
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:tryAgainLaterModal"
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={handleOnDone}>{t("errors.generic.button")}</Button>,
        }}
      />
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:GenericErrorModal"
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => setIsGenericErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={handleOnDone}>{t("errors.generic.button")}</Button>,
        }}
      />

      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:TransferLimitModal"
        title={t("InternalTransfers.ReviewTransferScreen.transferLimitError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.transferLimitError.message")}
        isVisible={isErrorTransferLimit}
        onClose={() => setIsErrorTransferLimit(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnDone}>{t("InternalTransfers.ReviewTransferScreen.notification.done")}</Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:senderTransferRejectedModal-isSenderTransferRejected"
        title={t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.title")}
        message={t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.message")}
        isVisible={isSenderTransferRejected}
        onClose={() => setSenderTransferRejected(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnLogout}>
              {t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.Ok")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:senderTransferRejectedModal-isReceiverTransferRejected"
        title={t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.title")}
        message={t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.message")}
        isVisible={isReceiverTransferRejected}
        onClose={() => setReceiverTransferRejected(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnDone}>
              {t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.Ok")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ReviewLocalTransferScreen:SASCheckStatusModal"
        title={t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.message")}
        isVisible={isSASCheckStatus}
        onClose={() => setSASCheckStatus(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnDone}>{t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.Ok")}</Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.duplicateStatusError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.duplicateStatusError.message")}
        isVisible={isDuplicateTransfer}
        onClose={() => setIsDuplicateTransfer(false)}
      />
    </>
  );
}

const SARIE_TRANSFER_CHECK_LIMIT = 20000;