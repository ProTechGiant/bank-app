import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useAccount from "@/hooks/use-account";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ReviewTransferDetail } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { sender } from "../mocks/mockSender";
import { Note } from "../types";

export default function ReviewTransferScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { transferAmount, reason, recipient } = useInternalTransferContext();
  // const { data } = useAccount();

  const [note, setNote] = useState<Note>({ content: "", attachment: "" });
  const [isVisible, setIsVisible] = useState(false);

  // const sender = { accountName: data?.currentAccountName, accountNumber: data?.currentAccoutNumber };

  const updateNote = (content: Note) => {
    setNote(content);
  };

  const handleOnClose = () => {
    setIsVisible(true);
  };

  const handleSendMoney = () => {
    //TODO: navigate to OTP
    navigation.navigate("InternalTransfers.ConfirmationScreen");
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
    </>
  );
}
