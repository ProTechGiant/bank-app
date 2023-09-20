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
import { useTransferLimitAmount } from "@/hooks/use-transfer-limit";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

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
  const internalTransferAsync = useInternalTransfer();
  const internalTransferCroatiaToARBAsync = useInternalTransferCroatiaToARB();
  const transferReason = useTransferReasonsByCode(reason, transferType);

  const [note, setNote] = useState<Note>({ content: "", attachment: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isErrorTransferLimit, setIsErrorTransferLimit] = useState(false);

  const updateNote = (content: Note) => {
    setNote(content);
  };

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const currentAccountBalance = (account && account.data && account.data.balance) ?? 0;

  const handleSendMoney = async () => {
    if (
      account.data === undefined ||
      reason === undefined ||
      transferAmount === undefined ||
      recipient.accountNumber === undefined
    ) {
      return;
    }
    if (transferAmount > transferLimitAmount || transferAmount > currentAccountBalance) {
      setIsErrorTransferLimit(true);
      return;
    }
    setIsErrorTransferLimit(false);

    const internalTransferDetails: InternalTransfer = {
      Reason: "internal-to-bank",
      data: {
        InternalTransferAmount: transferAmount.toString(),
        InternalTransferAmountCurrency: "SAR",
        DebtorAccountCustomerAccountId: account.data.id,
        CreditorAccountCustomerAccountId: recipient.accountNumber,
        RemittanceInformation: reason,
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
    };

    try {
      otpFlow.handle({
        action: {
          to: "InternalTransfers.ReviewTransferScreen",
        },
        // TODO: adding a number for QA to pass component testing, will be remove later as this value will be passed from context.
        otpChallengeParams: {
          PhoneNumber: "+961549845741",
        },
        otpOptionalParams: {
          internalTransferDetails,
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
        onFinish: status => {
          if (status === "cancel") {
            return;
          }

          invalidateBalances();

          if (status === "fail") {
            // if the otp is failed then we navigate the user to starting point.
            navigation.navigate("InternalTransfers.InternalTransfersStack", {
              screen: "InternalTransfers.PaymentsHubScreen",
            });
          } else {
            navigation.navigate("InternalTransfers.ConfirmationScreen");
          }
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("internal-transfer", "Could not request OTP: ", JSON.stringify(error));
    }
  };

  const { transferLimitAmount } = useTransferLimitAmount(String(account?.data?.id));

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
    setIsErrorTransferLimit(false);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
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
              <Button onPress={() => handleSendMoney()} variant="primary">
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
      />
      <NotificationModal
        variant="error"
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
    </>
  );
}
