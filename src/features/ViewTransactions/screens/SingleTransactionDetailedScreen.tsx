import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import format from "date-fns/format";
import { enUS } from "date-fns/locale";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";

import ApiError from "@/api/ApiError";
import { CircleQuestionMarkIcon, CloseIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useCaseDetails } from "@/features/PaymentDisputes/hooks/query-hooks";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { DetailsWrapper, SimilarTransactionsModal } from "../components";
import { useGetTransactionTags } from "../hooks/query-hooks";

interface SingleTransactionDetailedScreenProps {
  onClose: () => void;
  navigation: any;
}

function SingleTransactionDetailedScreen({ onClose, navigation }: SingleTransactionDetailedScreenProps) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "ViewTransactions.SingleTransactionDetailedScreen">>();

  const { mutationStatus, similarTransactions, data } = route.params;

  // TODO: remove hardcored transactionRef when case searching via transaction is available
  // error  = trans-ref-7
  // case found = trans-ref-[1-6]
  // no case = trans-ref-[8...]
  const transactionRef = "trans-ref-8";

  const [isCaseExistModalVisible, setIsCaseExistModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const caseDetailsResponse = useCaseDetails(transactionRef);
  const caseNumber = caseDetailsResponse?.data?.CaseNumber;
  const receivedData = route.params?.data;
  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const [isVisible, setIsVisible] = useState(false);

  const [isSimilarSuccessModalVisible, setIsSimilarSuccessModalVisible] = useState(false);
  const [similarTransactionsCount, setSimilarTransactionsCount] = useState(0);

  const [isUpdateErrorModalVisible, setIsUpdateErrorModalVisible] = useState(false);
  const [isSuccessNotificationModalVisible, setIsSuccessNotificationModalVisible] = useState(false);
  const [isViewingErrorModal, setIsViewingErrorModal] = useState(false);
  const [isSimilarTransactionsModalVisible, setIsSimilarTransactionsModalVisible] = useState(false);
  const { data: transactionTags, refetch, isLoading } = useGetTransactionTags(receivedData.transactionId.toString());

  useEffect(() => {
    switch (mutationStatus) {
      case "success":
        if (similarTransactions && similarTransactions.length > 0) {
          setIsSuccessNotificationModalVisible(true);
        } else {
          setIsUpdateErrorModalVisible(true);
        }
        break;
      case "error":
        setIsViewingErrorModal(true);
        break;
      default:
        break;
    }
  }, [mutationStatus, similarTransactions, route.params]);

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
    if (caseDetailsResponse.error instanceof ApiError && caseDetailsResponse.error.statusCode === 404) {
      navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
        screen: "PaymentDisputes.PaymentDisputeScreen",
        params: {
          cardId,
          createDisputeUserId,
          transactionDetails: receivedData,
        },
      });
    } else if (caseDetailsResponse.isSuccess) {
      setIsCaseExistModalVisible(true);
    } else {
      setIsErrorModalVisible(true);
    }
  };

  const handleOnCaseLink = () => {
    setIsCaseExistModalVisible(false);

    delayTransition(() => {
      navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
        screen: "PaymentDisputes.CaseDetailsScreen",
        params: {
          transactionRef,
        },
      });
    });
  };

  const handleOnCloseCaseExistModal = () => {
    setIsCaseExistModalVisible(false);
  };

  const handleOnPressCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  const handleOnSimilarTransactionsModalClose = (
    isSuccess: boolean | ((prevState: boolean) => boolean),
    similarTransactionCount: number
  ) => {
    setIsSimilarTransactionsModalVisible(false);
    setIsSuccessNotificationModalVisible(false);
    setIsSimilarSuccessModalVisible(isSuccess);
    setSimilarTransactionsCount(similarTransactionCount);
  };

  const handleonNavigateFAQ = () => {
    navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack", {
      screen: "FrequentlyAskedQuestions.DetailedScreen",
      params: {
        faqId: "update-contact-faq",
        // TODO: this is temporary till they provide us with the real IDs
      },
    });
    setIsVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      updateHeaderTitle(receivedData?.transactionDate);
    }
  }, [isFocused, receivedData?.transactionDate, updateHeaderTitle]);

  useEffect(() => {
    if (isFocused) {
      refetch();
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
    marginStart: theme.spacing["4p"],
  }));

  return (
    <>
      {caseDetailsResponse.isLoading === false && !isLoading ? (
        <Page insets={["bottom", "left", "right"]}>
          <DetailsWrapper
            openModel={setIsVisible}
            data={receivedData}
            cardId={cardId}
            createDisputeUserId={createDisputeUserId}
            onReportTransaction={handleOnReportTransaction}
            transactionTags={transactionTags.Tags}
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
            <Pressable style={styles.modalFooter} onPress={handleonNavigateFAQ}>
              <CircleQuestionMarkIcon />
              <Typography.Text style={FAQs} color="primaryBase" size="footnote" weight="medium">
                {t("ViewTransactions.AboutRoundUpsModal.note")}
              </Typography.Text>
            </Pressable>
          </Modal>
        </Page>
      ) : (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color="primaryBase" size="small" />
        </View>
      )}

      {mutationStatus === "error" ? (
        <NotificationModal
          variant="error"
          onClose={() => setIsViewingErrorModal(false)}
          isVisible={isViewingErrorModal}
          message={t("ViewTransactions.SingleTransactionDetailedScreen.ErrorModal.pleaseTryAgain")}
          title={t("ViewTransactions.SingleTransactionDetailedScreen.ErrorModal.somethingWrong")}
        />
      ) : null}

      {mutationStatus === "success" && similarTransactions && !isSimilarTransactionsModalVisible ? (
        <NotificationModal
          variant="success"
          message={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.similarTransactionsFound", {
            count: similarTransactions.length,
          })}
          title={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.categoryChangedSuccessfully")}
          isVisible={isSuccessNotificationModalVisible}
          buttons={{
            primary: (
              <Button
                onPress={() => {
                  setIsSimilarTransactionsModalVisible(true);
                  setIsSuccessNotificationModalVisible(false);
                }}>
                {t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.changeCategories")}
              </Button>
            ),
            secondary: (
              <Button onPress={() => setIsSuccessNotificationModalVisible(false)}>
                {t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.skip")}
              </Button>
            ),
          }}
        />
      ) : (
        <SimilarTransactionsModal
          cardId={cardId}
          createDisputeUserId={createDisputeUserId}
          data={data}
          similarTransactions={similarTransactions}
          visible={isSimilarTransactionsModalVisible}
          onClose={handleOnSimilarTransactionsModalClose}
        />
      )}

      {mutationStatus === "success"
        ? (!similarTransactions?.Transaction || similarTransactions.Transaction.length === 0) && (
            <NotificationModal
              variant="success"
              onClose={() => setIsUpdateErrorModalVisible(false)}
              isVisible={isUpdateErrorModalVisible}
              message={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.categoryChangedSuccessfully")}
              title={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.categoryChanged")}
            />
          )
        : null}

      <NotificationModal
        variant="success"
        onClose={() => setIsSimilarSuccessModalVisible(false)}
        isVisible={isSimilarSuccessModalVisible}
        message={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.similarTransactionsChanged", {
          count: similarTransactionsCount,
        })}
        title={t("ViewTransactions.SingleTransactionDetailedScreen.SuccessModal.categoryChanged")}
      />

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
  activityIndicator: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
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
