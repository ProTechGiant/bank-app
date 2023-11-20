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
import useLogout, { logoutActionsIds } from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import delayTransition from "@/utils/delay-transition";

import { ReviewTransferDetail } from "../components";
import { useInternalTransfer, useInternalTransferCroatiaToARB, useTransferReasonsByCode } from "../hooks/query-hooks";
import { InternalTransfer, InternalTransferToARBRequest, Note } from "../types";

export default function ReviewTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const account = useCurrentAccount();
  const invalidateBalances = useInvalidateBalances();

  const { transferAmount, reason, recipient, transferType } = useInternalTransferContext();
  const otpFlow = useOtpFlow();
  const signOutUser = useLogout();
  const internalTransferAsync = useInternalTransfer();
  const internalTransferCroatiaToARBAsync = useInternalTransferCroatiaToARB();
  const transferReason = useTransferReasonsByCode(reason, transferType);

  const [note, setNote] = useState<Note>({ content: "", attachment: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isErrorTransferLimit, setIsErrorTransferLimit] = useState(false);
  const [isSenderTransferRejected, setSenderTransferRejected] = useState(false);
  const [isReceiverTransferRejected, setReceiverTransferRejected] = useState(false);
  const [isSASCheckStatus, setSASCheckStatus] = useState(false);

  interface ErrorType {
    errorContent: {
      Errors: Array<{
        ErrorId: string;
      }>;
    };
  }

  const updateNote = (content: Note) => {
    setNote(content);
  };

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
      customerRemarks: "Customer Remarks", // @TODO: currently hardcode value will change it later.
      BeneficiaryId: recipient.beneficiaryId,
    };

    try {
      let otpResult = null;
      if (transferType === TransferType.CroatiaToArbTransferAction) {
        otpResult = await internalTransferCroatiaToARBAsync.mutateAsync(internalTransferCroatiaToARB);
      } else {
        otpResult = await internalTransferAsync.mutateAsync(internalTransferDetails);
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
            return internalTransferCroatiaToARBAsync.mutateAsync(internalTransferCroatiaToARB);
          } else {
            return internalTransferAsync.mutateAsync(internalTransferDetails);
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

  const handleAddNote = () => {
    navigation.navigate("InternalTransfers.AddNoteScreen", { updateNote: updateNote, note: note });
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
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleOnLogout = async () => {
    try {
      await signOutUser(logoutActionsIds.MANUALLY_ID);
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
        <NavHeader withBackButton />
        <ContentContainer isScrollView>
          <Stack direction="vertical" justify="space-between" flex={1}>
            {account.data !== undefined && reason !== undefined && transferAmount !== undefined ? (
              <ReviewTransferDetail
                onAddNotePress={handleAddNote}
                sender={{ accountName: account.data.name, accountNumber: account.data.accountNumber }}
                recipient={recipient}
                reason={transferReason.data?.Description !== undefined ? transferReason.data?.Description : reason}
                amount={transferAmount}
                note={note}
              />
            ) : null}
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button onPress={() => handleFocalCheck()} variant="primary">
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
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
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
            <Button onPress={handleOnLogout}>
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
            <Button onPress={handleOnDone}>
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
            <Button onPress={handleOnDone}>{t("InternalTransfers.ReviewTransferScreen.sasCheckStatusError.Ok")}</Button>
          ),
        }}
      />
    </>
  );
}
