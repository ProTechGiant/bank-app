import { format } from "date-fns";
import React, { useState } from "react";
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
import { useCurrentAccount, useInvalidateBalances } from "@/hooks/use-accounts";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import delayTransition from "@/utils/delay-transition";

import { ReviewTransferDetail } from "../components";
import { useInternalTransfer, useInternalTransferCroatiaToARB } from "../hooks/query-hooks";
import { InternalTransfer, InternalTransferToARBRequest } from "../types";

export default function ReviewTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const invalidateBalances = useInvalidateBalances();

  const { transferAmount, reason, recipient, transferType } = useInternalTransferContext();
  const otpFlow = useOtpFlow();
  const signOutUser = useLogout();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const { mutateAsync: internalTransferAsync, isLoading: internalTransferLoading } = useInternalTransfer();
  const { mutateAsync: internalTransferCroatiaToARBAsync, isLoading: internalTransferCroatiaToARBLoading } =
    useInternalTransferCroatiaToARB();

  const [note, setNote] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
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

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const handleError = (error: ErrorType) => {
    if (error?.errorContent?.Errors[0].ErrorId) {
      const errorCode = error.errorContent.Errors[0].ErrorId;
      if (errorCode === "0106") {
        delayTransition(() => {
          setSenderTransferRejected(true);
        });
      } else if (errorCode === "0107") {
        delayTransition(() => {
          setReceiverTransferRejected(true);
        });
      } else if (errorCode === "0001") {
        setSASCheckStatus(true);
      } else if (errorCode === "0127") {
        setIsDuplicateTransfer(true);
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
      reason === undefined ||
      transferAmount === undefined ||
      recipient.accountNumber === undefined
    ) {
      return;
    }

    const internalTransferDetails: InternalTransfer = {
      Reason: "internal-to-bank",
      data: {
        InternalTransferAmount: transferAmount.toString(),
        InternalTransferAmountCurrency: "SAR",
        DebtorAccountCustomerAccountId: account.data.id,
        CreditorAccountCustomerAccountId: recipient.accountNumber,
        RemittanceInformation: reason,
        BeneficiaryId: recipient.beneficiaryId,
        TransferPurpose: reason,
        Message: note,
      },
    };

    const internalTransferCroatiaToARB: InternalTransferToARBRequest = {
      transferAmount: transferAmount.toString(),
      transferAmountCurrency: account.data.currencyType,
      remitterIBAN: account.data.iban,
      remitterName: account.data.name,
      beneficiaryIBAN: recipient.iban,
      beneficiaryName: recipient.accountName,
      clientTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      transferPurpose: reason,
      transferType: "02",
      expressTransferFlag: "N",
      customerRemarks: note,
      BeneficiaryId: recipient.beneficiaryId,
    };

    try {
      let otpResult = null;
      if (transferType === TransferType.CroatiaToArbTransferAction) {
        otpResult = await internalTransferCroatiaToARBAsync(internalTransferCroatiaToARB);
      } else {
        otpResult = await internalTransferAsync(internalTransferDetails);
      }

      handleSendMoney(internalTransferCroatiaToARB, internalTransferDetails, otpResult.OtpId);
    } catch (error: any) {
      delayTransition(() => handleError(error));
    }
  };

  const handleSendMoney = async (
    internalTransferCroatiaToARB: InternalTransferToARBRequest,
    internalTransferDetails: InternalTransfer,
    otpId: string
  ) => {
    try {
      otpFlow.handle({
        action: {
          to: "InternalTransfers.ReviewTransferScreen",
        },
        otpOptionalParams: {
          internalTransferDetails,
          isOtpAlreadySent: true,
        },
        otpChallengeParams: {
          OtpId: otpId,
        },
        otpVerifyMethod:
          transferType === TransferType.CroatiaToArbTransferAction ? "croatia-to-arb" : "internal-to-bank",
        onOtpRequest: () => {
          if (transferType === TransferType.CroatiaToArbTransferAction) {
            return internalTransferCroatiaToARBAsync(internalTransferCroatiaToARB);
          } else {
            return internalTransferAsync(internalTransferDetails);
          }
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

          invalidateBalances();

          if (status === "fail") {
            // if the otp is failed then we navigate the user to starting point.
            navigation.navigate("Home.HomeTabs");
          } else {
            navigation.navigate("InternalTransfers.ConfirmationScreen");
          }
        },
      });
    } catch (error) {
      delayTransition(() => {
        setIsErrorModalVisible(true);
      });
      warn("internal-transfer", "Could not request OTP: ", JSON.stringify(error));
    }
  };

  const handleAddNote = (noteContent: string) => {
    setNote(noteContent);
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleOnContinue = () => {
    setIsVisible(false);
  };

  const handleOnDone = () => {
    setIsErrorModalVisible(false);
    setIsErrorTransferLimit(false);
    setSenderTransferRejected(false);
    setReceiverTransferRejected(false);
    setSASCheckStatus(false);
    setIsDuplicateTransfer(false);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
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
          testID="InternalTransfers.ReviewTransferScreen:NavHeader"
        />
        <ContentContainer isScrollView>
          <Stack direction="vertical" justify="space-between" flex={1}>
            {account.data !== undefined && transferAmount !== undefined ? (
              <ReviewTransferDetail
                VAT=""
                bankName={
                  transferType === TransferType.CroatiaToArbTransferAction
                    ? t("InternalTransfers.ConfirmNewBeneficiaryScreen.bankName")
                    : t("InternalTransfers.ReviewTransferDetailScreen.crotiabankName")
                }
                feeInc=""
                isLocalTransfer={false}
                handleAddNote={handleAddNote}
                sender={{ accountName: account.data.name, accountNumber: account.data.accountNumber }}
                recipient={recipient}
                amount={transferAmount}
              />
            ) : null}
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button
                onPress={() => handleFocalCheck()}
                variant="primary"
                loading={internalTransferLoading || internalTransferCroatiaToARBLoading}
                disabled={internalTransferLoading || internalTransferCroatiaToARBLoading}>
                {t("InternalTransfers.ReviewTransferScreen.sendMoney")}
              </Button>
              <Button onPress={() => handleOnClose()} variant="tertiary">
                {t("InternalTransfers.ReviewTransferScreen.cancel")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnCancel}>{t("InternalTransfers.ReviewTransferScreen.notification.cancel")}</Button>
          ),
          secondary: (
            <Button onPress={handleOnContinue}>
              {t("InternalTransfers.ReviewTransferScreen.notification.continue")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.ReviewTransferScreen.notification.message")}
        title={t("InternalTransfers.ReviewTransferScreen.notification.title")}
        isVisible={isVisible}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.somethingWentWrong")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={handleOnDone}>{t("errors.generic.button")}</Button>,
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.transferLimitError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.transferLimitError.message")}
        isVisible={isErrorTransferLimit}
        onClose={() => setIsErrorTransferLimit(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnDone}>
              {t("InternalTransfers.ReviewTransferScreen.transferLimitError.done")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.title")}
        message={t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.message")}
        isVisible={isSenderTransferRejected}
        onClose={() => setSenderTransferRejected(false)}
        buttons={{
          primary: (
            <Button testID="InternalTransfers.ReviewTransferScreen:senderTransferRejectedOk" onPress={handleOnLogout}>
              {t("InternalTransfers.ReviewTransferScreen.senderTransferRejected.Ok")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.title")}
        message={t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.message")}
        isVisible={isReceiverTransferRejected}
        onClose={() => setReceiverTransferRejected(false)}
        buttons={{
          primary: (
            <Button testID="InternalTransfers.ReviewTransferScreen:receiverTransferRejectedOk" onPress={handleOnDone}>
              {t("InternalTransfers.ReviewTransferScreen.receiverTransferRejected.Ok")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.title")}
        message={t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.message")}
        isVisible={isSASCheckStatus}
        onClose={() => setSASCheckStatus(false)}
        buttons={{
          primary: (
            <Button testID="InternalTransfers.ReviewTransferScreen:sasCheckStatusErrorOk" onPress={handleOnDone}>
              {t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.Ok")}
            </Button>
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
