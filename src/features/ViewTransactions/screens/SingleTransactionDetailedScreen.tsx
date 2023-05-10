import { useIsFocused } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import format from "date-fns/format";
import { enUS } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";

import { CircleQuestionMark, CloseIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";

import { DetailsWrapper } from "../components";

interface SingleTransactionDetailedScreenProps {
  onClose: () => void;
  navigation: any;
}

function SingleTransactionDetailedScreen({ onClose, navigation }: SingleTransactionDetailedScreenProps) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const route = useRoute<RouteProp<MainStackParams, "ViewTransactions.SingleTransactionDetailedScreen">>();
  const receivedData = route.params?.data;
  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const [isVisible, setIsVisible] = useState(false);

  // Function to update the header title
  const updateHeaderTitle = (isoDate: number[]) => {
    const [year, month, day, hours, minutes] = isoDate;

    navigation.setOptions({
      title: format(new Date(year, month - 1, day, hours ?? 0, minutes ?? 0), "EEE d MMM',' HH:mm", {
        locale: enUS,
      }),
    });
  };

  useEffect(() => {
    if (isFocused) {
      updateHeaderTitle(receivedData?.transactionDate);
    }
  }, [isFocused]);

  const modalHeader = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.title2,
    marginBottom: theme.spacing["8p"],
  }));

  const modalBody = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const FAQs = useThemeStyles<TextStyle>(theme => ({
    marginStart: theme.spacing["5p"],
  }));

  return (
    <Page insets={["bottom", "left", "right"]}>
      <DetailsWrapper
        openModel={setIsVisible}
        data={receivedData}
        cardId={cardId}
        createDisputeUserId={createDisputeUserId}
      />
      <Modal style={styles.modal} onClose={onClose} visible={isVisible}>
        <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
          <CloseIcon />
        </TouchableOpacity>
        <Typography.Text style={modalHeader} color="neutralBase+30" size="title2" weight="bold">
          {t("ViewTransactions.AboutRoundUpsModal.title")}
        </Typography.Text>
        <Typography.Text style={modalBody} color="neutralBase+30" size="callout" weight="regular">
          {t("ViewTransactions.AboutRoundUpsModal.bodyText")}
        </Typography.Text>
        <View style={styles.modalFooter}>
          <CircleQuestionMark />
          <Typography.Text style={FAQs} color="primaryBase" size="footnote" weight="medium">
            {t("ViewTransactions.AboutRoundUpsModal.note")}
          </Typography.Text>
        </View>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "flex-end",
  },
  modal: {
    height: 243,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  modalFooter: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default SingleTransactionDetailedScreen;
