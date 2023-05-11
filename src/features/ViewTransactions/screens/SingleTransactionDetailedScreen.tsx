import { useIsFocused } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import format from "date-fns/format";
import { enUS } from "date-fns/locale";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";

import { CircleQuestionMark, CloseIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useCaseDetails } from "@/features/PaymentDisputes/hooks/query-hooks";
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

  // TODO: remove hardcored caseNumber when case searching via transaction is available
  const caseNumber = "35665";
  const [isCaseExistModalVisible, setIsCaseExistModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const caseDetailsResponse = useCaseDetails(caseNumber);
  const caseDetails = caseDetailsResponse?.data?.PaymentsCase;
  const receivedData = route.params?.data;
  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const [isVisible, setIsVisible] = useState(false);

  // Function to update the header title
  const updateHeaderTitle = useCallback(
    (isoDate: number[]) => {
      const [year, month, day, hours, minutes] = isoDate;

      navigation.setOptions({
        title: format(new Date(year, month - 1, day, hours ?? 0, minutes ?? 0), "EEE d MMM',' HH:mm", {
          locale: enUS,
        }),
      });
    },
    [navigation]
  );

  const handleOnReportTransaction = () => {
    if (caseDetailsResponse.isError) {
      setIsErrorModalVisible(true);
    }
    if (caseDetails === undefined) {
      navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
        screen: "PaymentDisputes.PaymentDisputeScreen",
        params: {
          cardId,
          createDisputeUserId,
          transactionDetails: receivedData,
        },
      });
    } else {
      setIsCaseExistModalVisible(true);
    }
  };

  const handleOnCaseLink = () => {
    setIsCaseExistModalVisible(false);
    setTimeout(() => {
      navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
        screen: "PaymentDisputes.CaseDetailsScreen",
        params: {
          caseNumber: "35665", // TODO: BE provided a hardcoded ID
          source: receivedData.title,
        },
      });
    }, 300);
  };

  const handleOnCloseCaseExistModal = () => {
    setIsCaseExistModalVisible(false);
  };

  const handleOnPressCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      updateHeaderTitle(receivedData?.transactionDate);
    }
  }, [isFocused, receivedData?.transactionDate, updateHeaderTitle]);

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
    <>
      <Page insets={["bottom", "left", "right"]}>
        <DetailsWrapper openModel={setIsVisible} data={receivedData} onReportTransaction={handleOnReportTransaction} />
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
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnCaseLink}>
              {t("ViewTransactions.SingleTransactionDetailedScreen.caseExistsModal.viewCaseButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseCaseExistModal}>
              {t("ViewTransactions.SingleTransactionDetailedScreen.caseExistsModal.cancelButton")}
            </Button>
          ),
        }}
        message={`${t("ViewTransactions.SingleTransactionDetailedScreen.caseExistsModal.message")} ${caseNumber}.`}
        title={t("ViewTransactions.SingleTransactionDetailedScreen.caseExistsModal.title")}
        isVisible={isCaseExistModalVisible}
      />
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnPressCloseErrorModal}>
              {t("ViewTransactions.SingleTransactionDetailedScreen.ErrorModal.cancelButton")}
            </Button>
          ),
        }}
        message={t("ViewTransactions.SingleTransactionDetailedScreen.ErrorModal.message")}
        title={t("ViewTransactions.SingleTransactionDetailedScreen.ErrorModal.title")}
        isVisible={isErrorModalVisible}
      />
    </>
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
