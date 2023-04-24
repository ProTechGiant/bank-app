import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useAccount from "@/hooks/use-account";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { ReviewTransferDetail } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useInternalTransfer } from "../hooks/query-hooks";
import { InternalTransfer, Note } from "../types";

export default function ReviewTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { transferAmount, reason, recipient } = useInternalTransferContext();
  const { data } = useAccount();
  const otpFlow = useOtpFlow();
  const internalTransferAsync = useInternalTransfer();

  const [note, setNote] = useState<Note>({ content: "", attachment: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const sender = { accountName: data?.currentAccountName, accountNumber: data?.currentAccountNumber };

  const updateNote = (content: Note) => {
    setNote(content);
  };

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const handleSendMoney = async () => {
    const correlationId = generateRandomId();

    const internalTransferDetails: InternalTransfer = {
      InstructionIdentification: correlationId,
      InternalTransferAmount: transferAmount?.toString() || "",
      InternalTransferAmountCurrency: "SAR",
      DebtorAccountCustomerAccountId: data?.currentAccountId || "",
      CreditorAccountCustomerAccountId: recipient.accountNumber || "",
      RemittanceInformation: reason || "",
    };

    try {
      const response = await internalTransferAsync.mutateAsync(internalTransferDetails);

      otpFlow.handle({
        action: {
          to: "InternalTransfers.ReviewTransferScreen",
        },
        otpOptionalParams: {
          internalTransferDetails,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          otpFormType: "internal-transfer",
        },
        onOtpRequestResend: () => {
          return internalTransferAsync.mutateAsync(internalTransferDetails);
        },
        onFinish: status => {
          if (status === "cancel") {
            return;
          }
          if (status === "fail") {
            setIsErrorModalVisible(true);
            return;
          }
          navigation.navigate("InternalTransfers.ConfirmationScreen");
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("internal transfer", "Could not request OTP: ", JSON.stringify(error));
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
            <ReviewTransferDetail
              handleAddNote={handleAddNote}
              sender={sender}
              recipient={recipient}
              reason={reason || ""}
              amount={transferAmount || 0}
              note={note}
            />
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
        variant="confirmations"
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
    </>
  );
}
